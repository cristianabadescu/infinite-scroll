export interface Photo {
    width: number,
    height: number,
    id: string,
    author: string,
    url: string,
    download_url: string
}

export enum Direction {
    'down',
    'up'
}

export interface Limits {
    start: number,
    end: number
}