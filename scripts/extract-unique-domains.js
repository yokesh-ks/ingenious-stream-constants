const fs = require('fs')
const path = require('path')

const tvDir = path.join(__dirname, '..', 'tv')

function extractUniqueDomains() {
  const domains = new Set()

  try {
    const files = fs.readdirSync(tvDir)

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(tvDir, file)

        try {
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

          if (data.streamUrl) {
            const url = new URL(data.streamUrl)
            domains.add(url.hostname)
          }
        } catch (err) {
          console.error(`Error processing ${file}: ${err.message}`)
        }
      }
    }

    const uniqueDomains = Array.from(domains).sort()

    // Ensure output directory exists
    const outputDir = path.join(__dirname, '..', 'output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write to file
    const outputFile = path.join(outputDir, 'uniquedomain.txt')
    const content = uniqueDomains.join('\n')
    fs.writeFileSync(outputFile, content, 'utf8')

    console.log(`Unique domains written to ${outputFile}`)
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
}

if (require.main === module) {
  extractUniqueDomains()
}

module.exports = { extractUniqueDomains }
