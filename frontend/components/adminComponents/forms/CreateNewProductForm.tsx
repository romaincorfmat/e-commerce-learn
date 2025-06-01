import { useGetCategories } from "@/hooks/categories/useGetCategories";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateProductFormSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useCreateProduct from "@/hooks/products/useCreateProduct";
import { toast } from "sonner";
import { uploadImage } from "@/lib/actions/uploadImageClooudinary";

interface Props {
  onSuccess: () => void;
}

const CreateNewProductForm = ({ onSuccess }: Props) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        // setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    console.log("Selected file:", file);
  };

  const { data, isPending } = useGetCategories();
  const categories = data?.data || [];

  const form = useForm<z.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      imageUrl: "",
      variants: [
        {
          sku: "",
          stockLevel: 0,
          attributes: {
            color: "",
            size: "",
          },
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const createProductMutation = useCreateProduct();

  const handleSubmit = async (
    data: z.infer<typeof CreateProductFormSchema>
  ) => {
    console.log("Form data Submitted", data);

    try {
      // First check if we have an image to upload
      if (!imageFile) {
        toast.error("Please select an image file");
        return;
      }

      setIsUploading(true);

      // Upload the image to Cloudinary first
      let imageUrl = "";
      try {
        imageUrl = await uploadImage(imageFile);
        console.log("Cloudinary image URL:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
        setIsUploading(false);
        return;
      }

      // Then create the product with the Cloudinary URL
      createProductMutation.mutate(
        {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          price: data.price,
          imageUrl: imageUrl,
          variants: data.variants.map((variant) => ({
            sku: variant.sku,
            stockLevel: variant.stockLevel,
            attributes: {
              color: variant.attributes.color,
              size: variant.attributes.size,
            },
          })),
        },
        {
          onSuccess: () => {
            toast.success("Product created successfully");
            form.reset();
            setImageFile(null);
            // setImagePreview(null);
            setIsUploading(false);
            onSuccess();
          },
          onError: (error) => {
            toast.error("Failed to create product");
            console.error("Error creating product:", error);
            setIsUploading(false);
          },
        }
      );
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
      setIsUploading(false);
    }
  };

  const addVariant = () => {
    append({
      sku: "",
      stockLevel: 0,
      attributes: {
        color: "",
        size: "",
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h1 className="h1-title-page">Create a new product</h1>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full"
                  placeholder="Enter price"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="imageUrl"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Product Image</FormLabel>
              <FormControl>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="no-focus outline-none bg-transparent shadow-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-600"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  {/* {imagePreview && (
                    <div className="mt-2">
                      <p>{imageFile?.name}</p>
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="mt-2 max-h-40 object-contain"
                      />
                    </div>
                  )} */}
                  <Input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-fit" asChild>
                    <Button variant="ghost" className="border max-md:w-full">
                      {field.value
                        ? categories.find((cat) => cat._id === field.value)
                            ?.name || "Select Category"
                        : "Select Category"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent {...field}>
                    {!isPending && categories.length > 0 ? (
                      <>
                        <DropdownMenuLabel>Categories</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {categories.map((category) => (
                          <DropdownMenuItem
                            key={category._id}
                            onClick={() => field.onChange(category._id)}
                          >
                            {category.name}
                          </DropdownMenuItem>
                        ))}
                      </>
                    ) : (
                      <DropdownMenuItem disabled>
                        No categories available
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Product Variants Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Product Variants</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Variant
            </Button>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <Card key={field.id} className="border mb-4 last:mb-0">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Variant {index + 1}
                  </CardTitle>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <FormField
                    name={`variants.${index}.sku`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. RED-L-001" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`variants.${index}.stockLevel`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Level</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name={`variants.${index}.attributes.color`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Red" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name={`variants.${index}.attributes.size`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Large" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateNewProductForm;
