export default (children) => `<mjml>
    <mj-body background-color="#0f1418">
    <mj-section>
        <mj-column>
            <mj-image href="https://snowballtracker.io" src="https://snowballtracker.io/img/logo-light.png" width="230px" />
        </mj-column>
    </mj-section>
    <mj-section padding="18px">
        <mj-column background-color="#fff" border-radius="17px" padding="16px">
            ${children}
        </mj-column>
    </mj-section>
    </mj-body>
</mjml>`;
