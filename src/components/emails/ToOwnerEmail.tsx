import { Product } from "@/payload-types"
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Heading,
  Section,
  Hr,
} from '@react-email/components'
import { format } from 'date-fns'

interface ToOwnerEmailProps {
  customerName: string
  shippingAddress: string
  date: Date
  orderId: string
  products: Product[]
}

export const ToOwnerEmailHtml = ({
  customerName,
  shippingAddress,
  date,
  orderId,
  products,
}: ToOwnerEmailProps) => {
  const total = products.reduce((acc, curr) => acc + curr.price, 0)

  return (
    <Html>
      <Head />
      <Preview>New Order Received from {customerName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>🎉 New Order Received!</Heading>
          <Section style={section}>
            <Text style={text}>Order Details:</Text>
            <Text style={text}>
              Order ID: {orderId}<br />
              Date: {format(date, 'dd/MM/yyyy')}<br />
              Customer Name: {customerName}<br />
              Shipping Address: {shippingAddress}
            </Text>
          </Section>

          <Section style={section}>
            <Text style={text}>Ordered Items:</Text>
            {products.map((product) => (
              <Text key={product.id} style={text}>
                • {product.name} - ${product.price}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={section}>
            <Text style={text}>Total Order Value: ${total}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated email from House of Reika. Please process this order as soon as possible.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
}

const section = {
  padding: '20px 0',
}

const text = {
  margin: '0 0 10px',
  padding: '0',
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}