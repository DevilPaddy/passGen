export interface PasswordOptions {
    length: number;
    includeNumbers?: boolean;
    includeSymbols?: boolean;
    includeUppercase?: boolean;
    excludeSimilar?: boolean;
}


export const generatePassword = (options: PasswordOptions): string => {
    const {
        length,
        includeNumbers = true,
        includeSymbols = true,
        includeUppercase = true,
        excludeSimilar = true,
    } = options;

    // Base character sets
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:',.<>?";

    // Characters often confused
    const similarChars = /[lI1O0]/g;

    let chars = lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    if (includeUppercase) chars += uppercase;

    
    if (excludeSimilar) {
        chars = chars.replace(similarChars, "");
    }

    // Generate password
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
};
