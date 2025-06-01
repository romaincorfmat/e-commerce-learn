export const generateEmail = (
  name: string,
  domain: string = "example.com"
): string => {
  // Generate a simple email address based on the user's name and a domain
  const formattedName = name.toLowerCase().replace(/\s+/g, ".");
  return `${formattedName}@${domain}`;
};

export const generatePassword = (length: number = 8): string => {
  // Generate a random password of specified length
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const generateSlug = (name: string): string => {
  // Generate a URL-friendly slug from the given name
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
};
