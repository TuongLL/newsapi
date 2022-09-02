import * as bycrypt  from 'bcrypt'
export async function HashBcrypt(data: any) {
    return bycrypt.hash(data, 10)
}

export async function CompareBcrypt(password: string, hash: string) {
    return bycrypt.compare(password, hash)
}

