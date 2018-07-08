const fs = require('fs')
const { parseString, Builder } = require('xml2js')

const formatXMLObject = xmlObject => {
  const contents = xmlObject.contentList.content
  return contents.map(content => {
    return {
      uid: content.$.contentuid,
      message: content._
    }
  })
}

const parseXMLObject = arrObjects => {
  const contents = arrObjects.map(obj => {
    return {
      _: obj.message,
      $: { contentuid: obj.uid }
    }
  })
  return {
    contentList: {
      content: contents
    }
  }
}

const parseXML = xmlContent => {
  return new Promise((resolve, reject) => {
    parseString(xmlContent, function(err, xmlObject) {
      if (err) {
        reject(err)
      }
      resolve(formatXMLObject(xmlObject))
    })
  })
}

const parseXMLFromFile = xmlFilePath => {
  try {
    const xmlContent = fs.readFileSync(xmlFilePath)
    return parseXML(xmlContent)
  } catch (e) {
    return Promise.reject(e)
  }
}

const createXMLFromObject = (xmlObject, xmlFilePath) => {
  const xmlTranslated = new Builder({ headless: true }).buildObject(
    parseXMLObject(xmlObject)
  )
  fs.writeFileSync(xmlFilePath, xmlTranslated)
}

module.exports = {
  parseXMLFromFile,
  createXMLFromObject
}
