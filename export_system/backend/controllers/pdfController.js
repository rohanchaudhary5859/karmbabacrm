
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

module.exports.generateInvoice = async (req, res) => {
    try {
        const data = req.body;
        const templatePath = path.join(__dirname, "..", "templates", "invoice.html");
        let html = fs.readFileSync(templatePath, "utf8");

        Object.keys(data).forEach(k=>{
            html = html.replace(new RegExp("{{"+k+"}}","g"), data[k]);
        });

        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const filePath = path.join(__dirname, "..", "generated_invoice.pdf");
        await page.pdf({ path: filePath, format: "A4" });

        await browser.close();

        return res.download(filePath);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "PDF generation failed" });
    }
};
