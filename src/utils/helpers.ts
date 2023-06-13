export const usernameFromEmail = (email : string) => {
    if(!email.includes('@')) throw new Error('Invalid email');
    return email.split('@')[0];
}


