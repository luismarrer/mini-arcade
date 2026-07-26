export const AVATARS = [
    { value: 'batman', label: 'Batman', extension: 'avif' },
    { value: 'superman', label: 'Superman', extension: 'avif' },
    { value: 'wonder-woman', label: 'Wonder Woman', extension: 'avif' },
    { value: 'the-flash', label: 'The Flash', extension: 'avif' },
    { value: 'green-lantern', label: 'Green Lantern', extension: 'avif' },
    { value: 'supergirl', label: 'Supergirl', extension: 'avif' },
    { value: 'cyborg', label: 'Cyborg', extension: 'avif' },
    { value: 'catwoman', label: 'Catwoman', extension: 'avif' },
] as const

export type AvatarId = (typeof AVATARS)[number]['value']

export function getAvatarUrl(avatar: string): string {
    const knownAvatar = AVATARS.find((item) => item.value === avatar)
    return knownAvatar
        ? `/images/avatars/${knownAvatar.value}.${knownAvatar.extension}`
        : '/images/avatars/batman.avif'
}
