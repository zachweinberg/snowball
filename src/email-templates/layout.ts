import { DateTime } from 'luxon';

export default (children) => `<mjml>
    <mj-body background-color="#0f1418">
    <mj-section>
        <mj-column>
            <mj-image href="https://obsidiantracker.com" src="https://obsidiantracker.com/img/logo-light.png" width="230px" />
        </mj-column>
    </mj-section>
    <mj-section background-color="#fff" border-radius="17px">
        ${children}
    </mj-section>
    <mj-section>
        <mj-column>
        <mj-text color="#fff" align="center">&copy; ${
          DateTime.local().setZone('America/New_York').year
        } Obsidian Tracker LLC.</mj-text>
        <mj-text color="#fff" align="center">All rights reserved.</mj-text>
        </mj-column>
    </mj-section>
    </mj-body>
</mjml>`;
