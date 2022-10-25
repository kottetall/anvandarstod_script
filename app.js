const puppeteer = require("puppeteer")

// Selectors kan behöva uppdateras, testat 25/10-22
const steps = [
    { name: "leverantorslanken", selector: `#svid12_7f0846ac15f0dd8153b14a8c > div.footer-wrapper > div > div.row.footer-top > div.footer-col2.col-md-4 > ul > li:nth-child(2) > a` },
    { name: "webbstodslanken", selector: `#svid12_3e623d4f16735f3976e1521 > div:nth-child(2) > div > div > div:nth-child(2) > h2 > a` },
    { name: "anvandarstodForRespektiveTjanst", selector: `#h-Ovrigaanvandarstod` },
    { name: "lankTillAnvandarstodKrom", selector: `#svid12_47a458fb16df81b91331d8c > div.sv-text-portlet-content > p:nth-child(2) > a` },
]

let stepCounter = 1

async function main(viewport) {


    const startingUrl = "https://arbetsformedlingen.se"

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.setViewport(viewport)

    await page.goto(startingUrl)

    // Klicka bort cookiesgrejen
    console.log("klickar på rutan")
    await page.click("#afCookieAccept")

    // Väntar på att cookierutan ska försvinna
    console.log("Väntar på att rutan ska försvinna")
    await page.waitForTimeout(1000)

    console.log("Tar första screenshot")
    await page.screenshot({ path: `./output/${stepCounter}.start.png`, type: "png" })
    stepCounter++

    for (let step of steps) {
        const { name, selector } = step
        await markScreenShotAndNavigate(name, selector, page)
    }

    await browser.close()
}

async function markAndScrollTo(selector, page) {
    await page.$eval(selector, (element) => {
        const scrollIntoViewOptions = { block: "center" }
        element.scrollIntoView(scrollIntoViewOptions)
        element.style.outline = "4px solid red"
        element.style.outlineOffset = "5px"
    })
}

async function removeMarking(selector, page) {
    await page.$eval(selector, (element) => {
        element.style.outline = "initial"
        element.style.outlineOffset = "initial"
    })
}

async function markScreenShotAndNavigate(name, selector, page) {
    console.log(`\tCentrerar och markerar ${name}`)
    await markAndScrollTo(selector, page)

    console.log(`\tTar kort på ${name}`)
    await page.screenshot({ path: `./output/${stepCounter}.${name}.png`, type: "png" })
    stepCounter++

    console.log(`\tTar bort markering`)
    await removeMarking(selector, page)

    console.log(`Går till ${name}`)
    await page.click(selector)
    await page.waitForNetworkIdle()
}

const standardViewport = { width: 1920, height: 1080 }
main(standardViewport)