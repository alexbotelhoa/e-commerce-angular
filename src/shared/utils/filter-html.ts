import cheerio from 'cheerio'

export const filterHTML = (html: string): string => {
    const $ = cheerio.load(html)

    $('head script').remove()
    return $.html()
}