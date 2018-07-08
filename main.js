const translate = require('google-translate-api'),
  ProgressBar = require('progress'),
  delay = require('delay')

const {
  parseXMLFromFile,
  createXMLFromObject
} = require('./src/divinity-original-sin-xml-utils')

const XML_SOURCE = './resources/spanish.xml',
  XML_DESTINATION = './portuguese.xml',
  LANGUAGE_SOURCE = 'es',
  LANGUAGE_DESTINATION = 'pt',
  TRANSLATE_DELAY = 1000

parseXMLFromFile(XML_SOURCE)
  .then(xmlObjects => {

    const bar = new ProgressBar(':bar :current/:total', {
      total: xmlObjects.length
    })

    const callback = i => {
      bar.tick()
    }

    translateXmlObject(xmlObjects, TRANSLATE_DELAY, callback).then(
      translatedXmlObject => {
        createXMLFromObject(translatedXmlObject, XML_DESTINATION)
      }
    )
  })
  .catch(e => console.error(`Fail on parse XML at ${XML_SOURCE}`, e))

const translateXmlObject = async (xmlObjects, delayMilliseconds, callback) => {
  for (let i = 0; i < xmlObjects.length; i++) {
    await delay(delayMilliseconds)

    const opts = {
      from: LANGUAGE_SOURCE,
      to: LANGUAGE_DESTINATION
    }
    const result = await translate(xmlObjects[i].message, opts)
    xmlObjects[i].message = result.text

    callback(i)
  }

  return xmlObjects
}
