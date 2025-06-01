import { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/error";
import { Product } from "../database/models";
import { FilterQuery } from "mongoose";
import { generateSlug } from "../utils/utils";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // const loggedInUser = req.user;

    // if (!loggedInUser || loggedInUser.role !== "admin") {
    //   const error = new CustomError(
    //     "Unauthorized access -- Only Admin can Create Products",
    //     403
    //   );
    //   throw error;
    // }

    // console.log("Request body:", req.body);

    // const imageToUpload = req.body.imageUrl;
    // console.log("Image URL to upload:", imageToUpload);
    // if (!imageToUpload || typeof imageToUpload !== "string") {
    // throw new CustomError("Image URL is required and must be a string", 400);
    // }

    // const imageUrl = await uploadImage(imageToUpload);

    const existingProduct = await Product.findOne({ slug: req.body.slug });

    const incomingVariants = req.body.variants || [];

    if (existingProduct) {
      const existingSkus = existingProduct.variants.map(
        (variant: {
          sku: string;
          attributes: { color: string; size: string };
        }) => variant.sku
      );

      const newVariants = incomingVariants.filter(
        (variant: {
          sku: string;
          attributes: { color: string; size: string };
        }) => !existingSkus.includes(variant.sku)
      );

      if (newVariants.length === 0) {
        throw new CustomError(
          "All provided skus already exist in the product",
          409
        );
      }

      await Product.updateOne(
        { _id: existingProduct._id },
        { $push: { variants: { $each: newVariants } } }
      );

      const updatedProduct = await Product.find({
        _id: existingProduct._id,
      }).populate("categoryId");

      res.status(200).json({
        message: "Product variants added successfully",
        product: updatedProduct,
      });

      return;
    }

    const productSlug = generateSlug(req.body.name);

    const newProduct = await Product.create({
      ...req.body,
      slug: productSlug,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = req.params.id;

    if (!productId) {
      throw new CustomError("Product ID is required", 400);
    }

    const product = await Product.findById(productId).populate("categoryId");

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const filterQuery: FilterQuery<typeof Product> = {};

    if (req.query.search) {
      filterQuery.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.categoryId) {
      filterQuery.categoryId = req.query.categoryId;
    }

    const products = await Product.find(filterQuery).populate("categoryId");

    if (!products || products.length === 0) {
      throw new CustomError("No products found", 404);
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductSku(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.params || !req.params.sku) {
      throw new CustomError("SKU is required", 400);
    }

    const sku = req.params.sku;

    if (!sku) {
      throw new CustomError("SKU is required", 400);
    }

    const skuItem = await Product.findOne({
      "variants.sku": sku,
    })
      .select({
        "variants.$": 1,
        name: 1,
        description: 1,
        price: 1,
        categoryId: 1,
        slug: 1,
      })
      .populate("categoryId");

    res.status(200).json({
      message: "Product SKU retrieved successfully",
      sku: skuItem,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = req.params.id;

    if (!productId) {
      throw new CustomError("Product ID is required", 400);
    }

    const productToDelete = await Product.findByIdAndDelete(productId);

    if (!productToDelete) {
      throw new CustomError("Product not found", 404);
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: productToDelete,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductSku(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: productId, sku } = req.params;

    if (!productId || !sku) {
      throw new CustomError("Product ID and SKU are required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    const skuToDelete = product.variants.find(
      (variant: { sku: string }) => variant.sku === sku
    );

    if (!skuToDelete) {
      throw new CustomError("SKU not found in the product", 404);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $pull: { variants: { sku } },
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw new CustomError("Failed to update product", 500);
    }

    res.status(200).json({
      message: "Product SKU deleted successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      throw new CustomError("Request body is required", 400);
    }

    const productId = req.params.id;

    if (!productId) {
      throw new CustomError("Product ID is required", 400);
    }

    const productToUpdate = await Product.findById(productId);

    if (!productToUpdate) {
      throw new CustomError("Product not found", 404);
    }

    const updatedData = { ...req.body };

    if (updatedData.variants) {
      delete updatedData.variants;

      const incomingVariants = req.body.variants || [];
      if (!Array.isArray(incomingVariants) || incomingVariants.length === 0) {
        throw new CustomError("Variants must be a non-empty array", 400);
      }
      const existingSkus = productToUpdate.variants.map(
        (variant: { sku: string }) => variant.sku
      );

      if (!Array.isArray(incomingVariants) || incomingVariants.length === 0) {
        throw new CustomError("Variants must be a non-empty array", 400);
      }
      const newVariants = incomingVariants.filter(
        (variant: { sku: string }) => !existingSkus.includes(variant.sku)
      );
      if (!Array.isArray(incomingVariants) || incomingVariants.length === 0) {
        throw new CustomError("Variants must be a non-empty array", 400);
      }
      const exisingVariants = productToUpdate.variants.map(
        (variant: { sku: string }) => {
          const matchingvariants = incomingVariants.find(
            (v: { sku: string }) => {
              return v.sku === variant.sku;
            }
          );

          return matchingvariants || variant;
        }
      );

      updatedData.$set = {
        ...updatedData,
        variants: [...exisingVariants, ...newVariants],
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    ).populate("categoryId");

    if (!updatedProduct) {
      throw new CustomError("Failed to update product", 500);
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function sellProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: productId, sku } = req.params;
    const { quantity } = req.body;

    if (!productId || !sku) {
      throw new CustomError("Product ID and SKU are required", 400);
    }

    if (!quantity || quantity <= 0) {
      throw new CustomError("Valid quantity is required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    const variantIndex = product.variants.findIndex(
      (variant: { sku: string }) => variant.sku === sku
    );

    if (variantIndex === -1) {
      throw new CustomError("Product variant not found", 404);
    }

    const variant = product.variants[variantIndex];

    if (!variant.stockLevel || variant.stockLevel < quantity) {
      throw new CustomError("Insufficient stock", 400);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, "variants.sku": sku },
      {
        $inc: {
          "variants.$.stockLevel": -quantity,
        },
      },
      { new: true }
    ).populate("categoryId");

    if (!updatedProduct) {
      throw new CustomError("Failed to update product stock", 500);
    }

    res.status(200).json({
      message: "Product sold successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
}

export async function receiveStock(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      throw new CustomError("Request body is required for this operation", 400);
    }

    const { sku } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      throw new CustomError("Valid quantity is required", 400);
    }

    const product = await Product.findOne({ "variants.sku": sku });

    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    const variantToUpdate = product.variants.find(
      (variant: { sku: string }) => variant.sku === sku
    );

    if (!variantToUpdate) {
      throw new CustomError("Product variant not found", 404);
    }

    variantToUpdate.stockLevel = (variantToUpdate.stockLevel || 0) + quantity;
    await product.save();

    res.status(200).json({
      message: "Product received successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const categoryId = req.params.category;
    if (!categoryId) {
      throw new CustomError("Category ID is required", 400);
    }

    const products = await Product.find({
      categoryId,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    if (!products || products.length === 0) {
      throw new CustomError("No products found in this category", 404);
    }

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
}
