import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        {/* Buy Me a Coffee widget - load before NextScript so DOMContentLoaded listener registers in time */}
        <script
          defer
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="kostas.t"
          data-description="Support me on Buy me a coffee!"
          data-message="Thanks for stopping by! If this project helped you, a coffee keeps it running ☕️"
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        ></script>
        <NextScript />
      </body>
    </Html>
  )
}