npm install

node app.js

dans POSTMAN :

POST : localhost:8000/soap

HEADERS :
- Content-Type => text/xml, charset=utf-8
- SOAPAction => urn:bonjour


BODY raw - XML:
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tns="http://www.examples.com/bonjour">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:bonjour>
      <name>Julien</name>
    </tns:bonjour>
  </soapenv:Body>
</soapenv:Envelope>
