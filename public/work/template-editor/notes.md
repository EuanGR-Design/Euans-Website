# Legalesign Template Editor: prototype notes

Source: https://love-model-19724475.figma.site/ (Figma Make). Captured 27 Oct 2026 at a 1440×900 viewport (2× pixel density).

## What's in the prototype

**Editor (behind the modal).** It's a template editor for a "Template Creation / Rental Agreement" file. On the left is a *Participant Fields* panel with a participant selector (01 Lead Tenant · Signer) and these field types: Signature, Text, Signing Date, Date, Email, Initials, Number, Dropdown, Checkbox and More Field Types. Template Settings and Manage Participants sit at the bottom of that panel. The centre shows a two-page Residential Tenancy Agreement (England and Wales) with page controls (1/2). The bottom-right toolbar has zoom out, the zoom level, zoom in, fit width, fit height and a panel toggle. The top-right has a checklist button with a badge and a Next button. The top bar has Exit, a **User Testing** pill that reopens the testing modal, and the template breadcrumb. The participants are Person Sending (Sender), Lead Tenant (Signer), Co-Tenant (Signer) and Landlord (Approver), each with its own colour. Add Participant appears in the dropdown.

**User Testing modal.** It opens on load and reopens from the User Testing pill. It has four tabs:

1. **Introduction**: The Legalesign Template Editor title, a one-line summary, a **Start Testing** button ("This will open a checklist on the right side of your screen"), three feature cards (Multi-Recipient Management, Smart Field Placement, Document Validation) and a *Product Purpose* list.
2. **Testing Script**: The full written script in 5 sections. These are Initial Setup & Navigation, Recipient Management, Field Placement & Management, Advanced Field Operations, and Document Validation & Completion. Each step is concrete, e.g. "Add a witness… observe the recipient numbering (e.g., 2.1)". The tab also has Start Testing, ← Back to Introduction and Provide Feedback.
3. **Feedback**: The User Feedback Form has 9 questions in 3 groups (User Experience & Interface, Functionality & Features, General Usability). It uses 1–5 rating scales, free-text boxes and two dropdowns (Very Easy → Very Difficult). A green *Thank You!* card at the end holds **Download Results**, which generates a PDF in the browser named `legalesign-feedback-<timestamp>.pdf` with the answers. Nothing is sent to a server.
4. **Feature Flag**: Feature Flag Configuration lets testers "Toggle between different versions of features for A/B testing". It has three switches, each labelled Version A or B:
   - *Participant Dropdown Position*: A puts it in the left panel. B floats it centred above the document and hides it while a field is selected, so it doesn't clash with the formatting toolbar.
   - *Auto-Select Placed Fields*: A stays on the fields panel after placing a field. B auto-selects the new field and jumps to the Content panel.
   - *Participant Colour Glow*: A uses a neutral page border. B gives the page border and glow the selected participant's colour, and it updates as you switch.
   - The tab also has ← Back to Feedback and **Return to App**.

**Test Checklist (guided tour).** Start Testing closes the modal and docks a *Test Checklist* panel on the right, with a progress bar (0/23). A note explains that the checklist is a testing aid and not part of the product. The tasks sit in 5 collapsible groups with per-group counts: Setup & Navigation (4), Participant Management (5), Field Placement (5), Advanced Features (5) and Validation & Completion (4). The tasks are written as goals rather than instructions, e.g. "Change the document zoom: Try to make the document bigger and smaller." Ticking a task turns it green and strikes it through, and the counters update. The panel can be minimised or closed.

## Files

| Clip | Shows | Stills |
|---|---|---|
| `intro.mp4` (~9.8s) | Intro modal on load, a scroll through the feature cards and Product Purpose, then a hover on Start Testing | `intro.png`, `intro-purpose.png`, `intro-poster.jpg` |
| `tour.mp4` (~10.2s) | Testing Script tab → Start Testing → the checklist opens → tick "Get oriented" → zoom in twice → tick "Change the document zoom" → expand Participant Management | `tour-script.png`, `tour.png`, `tour-poster.jpg` |
| `ab-toggle.mp4` (~11.9s) | Feature Flag tab → turn Dropdown Position and Colour Glow to Version B → Return to App (floating dropdown, blue glow) → switch to Landlord (orange glow) → reopen the modal → back to Version A → Return to App | `ab-toggle-flags.png`, `ab-toggle.png` (Version B), `ab-toggle-versionA.png`, `ab-toggle-poster.jpg` |
| `feedback.mp4` (~10.4s) | Rate Q1, type a short sample answer, rate Q3, choose "Easy" in Q4, scroll to Thank You → Download Results | `feedback.png`, `feedback-download.png`, `feedback-poster.jpg` |

There are also two extras: `feedback-sample.pdf`, the PDF that Download Results produced during the recording, and `feedback-pdf.png`, a preview of its first page.

Video spec: H.264 High, 1920×1200, 30fps, yuv420p, no audio track, faststart. Each file is under 1.1 MB. The screenshots are 2880×1800 PNGs. The posters are 1920×1200 JPGs. The cursor in the clips is a rendered overlay, because headless capture has none. Only sample answers were entered, and no personal data.
