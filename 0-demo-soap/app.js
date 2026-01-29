const soap = require('strong-soap').soap;
const http = require('http');

const service = {
    BonjourService: {
        BonjourPort: {
            // Méthode Bonjour
            bonjour: function(args) {
                return {
                    message: 'Bonjour !'
                };
            },
            // Méthode Au revoir
            auRevoir: function(args) {
                return {
                    message: 'Au revoir !'
                };
            }
        }
    }
};


const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://www.examples.com/bonjour"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  targetNamespace="http://www.examples.com/bonjour"
  name="BonjourService">

  <types>
    <xsd:schema targetNamespace="http://www.examples.com/bonjour" elementFormDefault="qualified">
      <xsd:element name="bonjour">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="name" type="xsd:string" minOccurs="0"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <xsd:element name="bonjourResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="message" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <xsd:element name="auRevoir">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="name" type="xsd:string" minOccurs="0"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <xsd:element name="auRevoirResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="message" type="xsd:string"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <message name="bonjourRequest">
    <part name="parameters" element="tns:bonjour"/>
  </message>
  <message name="bonjourResponse">
    <part name="parameters" element="tns:bonjourResponse"/>
  </message>

  <message name="auRevoirRequest">
    <part name="parameters" element="tns:auRevoir"/>
  </message>
  <message name="auRevoirResponse">
    <part name="parameters" element="tns:auRevoirResponse"/>
  </message>

  <portType name="BonjourPortType">
    <operation name="bonjour">
      <input message="tns:bonjourRequest"/>
      <output message="tns:bonjourResponse"/>
    </operation>
    <operation name="auRevoir">
      <input message="tns:auRevoirRequest"/>
      <output message="tns:auRevoirResponse"/>
    </operation>
  </portType>

  <binding name="BonjourBinding" type="tns:BonjourPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="bonjour">
      <soap:operation soapAction="urn:bonjour"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
    <operation name="auRevoir">
      <soap:operation soapAction="urn:auRevoir"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <service name="BonjourService">
    <port name="BonjourPort" binding="tns:BonjourBinding">
      <soap:address location="http://localhost:8000/soap"/>
    </port>
  </service>
</definitions>`;


const server = http.createServer(function(request, response) {
    response.end("404: Not Found: " + request.url);
});


soap.listen(server, '/soap', service, wsdl);


server.listen(8000, function() {
    console.log('Le serveur SOAP est en écoute sur http://localhost:8000/soap');
});
