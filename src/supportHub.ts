// Support Hub's research: the six personas, the three story maps and how
// the help directions were ranked. Used by its project page (src/projects.ts).

import type { Block, PersonaCard, StoryMap } from "./projects";

export const supportPersonas: PersonaCard[] = [
  {
    name: "Taylor",
    label: "Daily user",
    age: 27,
    role: "Administrative assistant",
    bio: "Sends contracts, NDAs and onboarding forms for signing all day in a busy office. Organised, and getting comfortable with digital tools.",
    quote: "I need help when I don't know what to do.",
    goals: [
      "Send high volumes of documents accurately and on time.",
      "Know where every document is without chasing.",
      "Work things out without bothering anyone senior.",
    ],
    frustrations: [
      "A steep learning curve, and new features to keep up with.",
      "Slow replies from support.",
      "Self-service help that's hard to find.",
    ],
    tech: "Low",
    help: ["In-app tooltips", "Guided tours", "FAQs", "Live chat"],
    mvp: true,
  },
  {
    name: "Olivia",
    label: "Team admin",
    age: 36,
    role: "Operations manager",
    bio: "Runs her team's access, templates and reports. Fixes the basic problems herself and escalates the rest, then reports on the team to leadership.",
    quote: "I need to report tickets, see their status and escalate them.",
    goals: [
      "Keep the team productive and unblocked.",
      "Monitor the team through reports and KPIs.",
      "Raise and escalate problems on the team's behalf.",
    ],
    frustrations: [
      "Little insight into how the team is doing.",
      "Pulling data together by hand from several places.",
      "Little control over daily users' workflows.",
    ],
    tech: "Medium",
    help: ["Admin tooltips", "Guided tours", "Short tutorials", "Shareable guides"],
    mvp: true,
  },
  {
    name: "Tony",
    label: "Enterprise admin",
    age: 52,
    role: "Enterprise IT administrator",
    bio: "Head of IT at a large, regulated organisation in London. Rolls out software securely across departments and answers for the contract.",
    quote: "Is Legalesign keeping to our SLA?",
    goals: [
      "Keep the rollout secure and compliant.",
      "Prove the SLA is being met, and track spend.",
      "Report the key numbers to the people who sign off.",
    ],
    frustrations: [
      "No view across departments.",
      "Unclear pricing as the organisation grows.",
      "Constantly fixing technical problems for end users.",
    ],
    tech: "High",
    help: ["Technical docs", "Live demos", "Training sessions", "Case studies"],
    mvp: true,
  },
  {
    name: "Wendy",
    label: "Power user",
    age: 38,
    role: "Workflow lead",
    bio: "Works remotely between technical and operational roles. Designs workflows, manages templates and trains her colleagues on advanced features.",
    quote: "Everyone comes to me when something breaks.",
    goals: [
      "Automate workflows and connect them to the CRM.",
      "Control templates and conditional workflows.",
      "Use reports to improve the team's efficiency.",
    ],
    frustrations: [
      "Workflows that aren't flexible enough.",
      "Troubleshooting that's harder than it should be.",
      "Being the go-to person for everyone's problems.",
    ],
    tech: "High",
    help: ["Advanced guides", "Beta programmes", "Direct support", "Feature announcements"],
  },
  {
    name: "Alex",
    label: "API developer",
    age: 32,
    role: "Backend engineer",
    bio: "Builds signing into his company's own products and systems through the API, and documents it for the other developers.",
    quote: "I need to understand how to use the API.",
    goals: [
      "Integrate the API cleanly into existing workflows.",
      "Keep API-driven processes fast, reliable and secure.",
      "Ship features end users don't have to think about.",
    ],
    frustrations: [
      "Incomplete or unclear API documentation.",
      "Unexpected downtime breaking workflows.",
      "Edge cases like custom templates and error responses.",
    ],
    tech: "High",
    help: ["API docs", "Changelogs", "Code samples", "Developer forums"],
  },
  {
    name: "Paul",
    label: "Procurement",
    age: 43,
    role: "Procurement officer",
    bio: "Sends purchase agreements and supplier contracts, and coordinates sign-off between suppliers, finance and legal.",
    quote: "The documentation must fully describe the system.",
    goals: [
      "Shorten the contract cycle for vendor agreements.",
      "Stay compliant with procurement policy and audits.",
      "Spend less time on manual paperwork.",
    ],
    frustrations: [
      "Delays from manual processes and scattered emails.",
      "Not knowing where a contract is in its approvals.",
      "Juggling several versions of one document.",
    ],
    tech: "Medium",
    help: ["Email updates", "Setup guides", "Compliance resources", "Vendor-friendly docs"],
  },
];

// Each line is "[Task] > Step: story | story", copied from the story maps on
// the planning board. A leading * marks a story above the MVP line.
function parseMap(persona: string, label: string, raw: string): StoryMap {
  const tasks: StoryMap["tasks"] = [];
  for (const line of raw.trim().split("\n")) {
    const m = line.match(/^\[(.+?)\] > (.+?): (.+)$/);
    if (!m) continue;
    const [, task, step, rest] = m;
    let t = tasks.find((x) => x.title === task);
    if (!t) tasks.push((t = { title: task, steps: [] }));
    t.steps.push({
      title: step,
      stories: rest.split(" | ").map((s) => (s.startsWith("*") ? { text: s.slice(1), mvp: true } : { text: s })),
    });
  }
  return { persona, label, tasks };
}

export const supportStoryMaps: StoryMap[] = [
  parseMap(
    "Taylor",
    "Daily user",
    `[Create Support Enquiry] > Open Ticket Modal: *Access Help | *Choose Create Support Ticket Inquiry | *Fill Ticket Creation Base form: Title, Description, Priority, URL, Location | *Automatic ticket data: User ID, Group ID, Org ID, date and time, URL, error codes and logs | Check FAQs | Access Global Help
[Create Support Enquiry] > Gather Information on Issue: *Gather notes | *Copy Logs/Error Codes | Take Screenshot | Take Screen Recording
[Create Support Enquiry] > Fill out Support Inquiry Details: *Add a title for the ticket | *Add a description for the ticket | *Assign a priority level | Paste Logs/Error Codes | Add category/type Label | Upload Screenshot | Upload Screen Recording | Upload file | Create custom ticket fields | Add automated escalation rules | Add an Issue Type
[Create Support Enquiry] > Submit Support Inquiry: *Send to Support | Review Ticket Details | Look through links to support resources based on ticket details (self-service troubleshooting) | Include line manager (Team/Org Admin) in support inquiry | Get approval first from line manager before sending
[Track a Support Ticket] > Navigate to Support Ticket Listings Page: *Navigate to ticket listings from entry point | *Open in Microsite | Open in new window
[Track a Support Ticket] > Locate the Ticket: *Scroll through list | *Live view, newest or modified first | Sort | Search all ticket titles | Filter by status: in progress, done, escalated | Select ticket display view (Dashboard, Overview, List, Kanban)
[Track a Support Ticket] > Check Ticket Status: *Scan ticket statuses | Filter by Status
[Escalate Ticket Priority] > Select Ticket: *Select specific ticket | *Enter/open ticket | View ticket overview | View ticket summary
[Escalate Ticket Priority] > Increase Priority Level of Ticket: *Add priority level | *Update/Edit priority level | *Increase priority level (low, medium, high) | Push ticket to top | Mark as blocking (urgent to continue work) | Alert internal management of impact severity
[Support Ticket Updates] > Receive Notification: *Receive Email notification | *Visual alert in UI (red dot) | *In-app toast | Receive in-app notification | Receive notification in another app (e.g. Slack)
[Support Ticket Updates] > Locate Updated Ticket: *Ticket appears at top of list view | *View updated time | See ticket visually marked as updated | Sort by recent updates | Sort by date
[Support Ticket Updates] > View Updates: *View ticket thread: communications, links, resources | *Look at ticket log/history | View top-level ticket changes
[Track Progress of All Open Tickets] > Navigate to Ticket Listings: *Navigate to ticket listings
[Track Progress of All Open Tickets] > Select How to View all Tickets: *Select List view | Select Dashboard view | Select ticket display view (Dashboard, Overview, List, Kanban)
[Track Progress of All Open Tickets] > View Progress Status: *Scroll through List | *Scan ticket status from the list | Open preview of ticket | View progress on Boards
[Check Recently Resolved Tickets] > Locate Resolved Tickets: *Scroll through List | Filter all tickets by Closed/Done status | View page of recently resolved tickets
[Check Recently Resolved Tickets] > Review Proposed Solution: *Enter tickets | *Check ticket details | *Check proposed solutions | *Read through communications | *Read attached resources
[Check Recently Resolved Tickets] > Verify Success of Solution: *Assess whether the issue persists or is resolved: reply within 2 days, follow up at 5, assume resolved at 7 with no feedback
[Mark Success of Ticket] > Select Ticket: *Enter tickets
[Mark Success of Ticket] > Mark as Done or Unresolved: *Mark ticket as Done or Unresolved | Raise ticket with internal management for sign-off | Inform management of ticket outcome
[Check Previously Resolved Inquiries] > Select Listings View of Past Tickets: *View all past tickets | *View ticket log history
[Check Previously Resolved Inquiries] > Find Desired Ticket: *Scroll list to find ticket | Filter by Resolved Tickets | Search by issue title | Search by issue description | Sort by ticket date | Filter by date range
[Check Previously Resolved Inquiries] > Select Resolved Ticket(s): *Enter Ticket | Open ticket Preview | Multi-select similar tickets
[Check Previously Resolved Inquiries] > Check Resolutions & Actions Taken: *View ticket thread/log
[Open a New Ticket From a Previous Issue] > Find Desired Ticket: *Scroll list to find ticket | Filter by Resolved Tickets | Search by issue title | Search by issue description | Search by issue tag/category | Search by URL | Search by support assignee
[Open a New Ticket From a Previous Issue] > Check Solutions Still Work: *View ticket thread/log of previous solutions | View solutions alongside live UI to test them
[Open a New Ticket From a Previous Issue] > Open New Issue: *Choose Create Support Ticket Inquiry | Reopen Ticket | Open new ticket linked to existing issue | Clone Ticket
[Open a New Ticket From a Previous Issue] > Provide Additional Details: *Add details through email | *View all communications in one place (ticket thread) | *Add information in the ticket thread | Update issue description/title | Upload new evidence: screenshots, recordings, files | Update current Console version`,
  ),
  parseMap(
    "Olivia",
    "Team admin",
    `[View/Track All Team Tickets in One Place] > Navigate to Ticket Listings: *Navigate to ticket listings
[View/Track All Team Tickets in One Place] > Select How to View all Tickets: *View a list of tickets | *Choose to view tickets as stats | Reveal all ticket details from the list | View a snippet of the ticket description | View a summary of tickets | View tickets on a Kanban board
[View/Track All Team Tickets in One Place] > Filter/Sort Tickets: View by urgency | View by label/category | View by status | View by priority | View per user
[View/Track All Team Tickets in One Place] > View Open/Closed Stats: *View overview stats | View preview of tickets | Select ticket display view (Dashboard, Overview, List, Kanban) | AI summary of tickets
[Follow Up on Blocking/Urgent Issues] > Get Notified of an Urgent Issue: *Receive Email notification | *Visual alert in UI (on list item) | *In-app toast | Receive in-app notification | Receive notification in another app (e.g. Slack)
[Follow Up on Blocking/Urgent Issues] > Navigate to Ticket Listings: *Navigate to ticket listings | *Follow link to listings in notification | Quick copy issue ID from notification | Quick copy issue title
[Follow Up on Blocking/Urgent Issues] > Select Blocking Issue: *Scroll to find ticket | *Follow link to ticket in notification | Search issues by title | Search issues by ID | Filter issues by blocking
[Follow Up on Blocking/Urgent Issues] > Review What is Blocking: *Drill into ticket details | *Read ticket thread | *Read ticket log | View preview of tickets | View summary of tickets
[Escalate on Behalf of a Team Member] > Escalate Support Issue: *Update ticket priority/urgency | Prompt a reminder to support | Take control of the ticket (assign to self)
[Escalate on Behalf of a Team Member] > Add Details to a Team Member's Ticket: *Follow up with team member about open issue outside the app | Leave a comment in support thread | Link to relevant resources | Upload additional information | Link related issues across the team
[Change Ticket Listings View] > View Ticket Listing: *Navigate to ticket listings
[Change Ticket Listings View] > Choose View: *Select personal view | *Select team view | View by open/closed | View by category | Select ticket preview view | View by team member | Select ticket view (Dashboard, Overview, List, Kanban)
[Review Updated Tickets] > Get Notified of Updates: *Update appears at top of list (most recent) | *Receive Email notification | *Visual alert in UI | Receive in-app notification | Receive notification in another app (e.g. Slack)
[Review Updated Tickets] > Review Updates: *View date of updates | *View time of updates | *View live updates | *View who made the updates | *Follow link to the ticket update | Follow alert dots to updates | See whether something has been edited | View state before update was made
[Review Updated Tickets] > Decide What Happens Next: *Assess communication | *Assess links to resources
[Check Resolved Enquiries Across Teams] > View All Past Tickets for the Team: *View list of all tickets | Filter by date range | Sort by status | Past ticket view
[Check Resolved Enquiries Across Teams] > Find Desired Ticket: *Scroll list and scan for resolved status | Search by title | Search by description | Search by label/category | Filter by label/category | Filter by past/resolved | Filter by location | Filter by feature | Search by URL
[Check Resolved Enquiries Across Teams] > Select Resolved Ticket(s): *Scroll through a list of resolved tickets | Filter by resolved tickets | Search in resolved tickets | Select several resolved tickets in one action
[Check Resolved Enquiries Across Teams] > Check Resolutions & Actions Taken: *Review past logs/correspondence | *Scroll through all resources attached to a ticket | Search for resources in one place
[Compare Similar Tickets Across Teams] > Find Similar Tickets: *Open multiple tickets in new tabs | Reveal more ticket details from the list | See tickets in a preview | See tickets side by side | Select multiple tickets to open
[Compare Similar Tickets Across Teams] > Review & Compare Tickets: *Compare responses to ticket issues | Compare linked resources | See resources grouped for similar tickets | View all tickets under one parent | AI summary of similarities and differences
[Analyse Support Performance] > Select Tickets for Analysis: *Select time period | *Select all tickets under the team | Select specific ticket type | Select specific ticket statuses | Select specific teams (admin of several teams)
[Analyse Support Performance] > Choose Stats and Metrics: *Specify date range | According to a specific metric | Organise data by user
[Analyse Support Performance] > View Stats: *Basic number outputs | *Charts and graphs | *Tables/spreadsheets | Dashboard | Widgets
[Export Reports] > Export Findings: *Export as XLS/CSV | Export as PDF | Export as raw data | Bulk export reports | Export a specific section of data | Live link to a spreadsheet
[Export Reports] > Share Findings with the Enterprise Admin: *Send report through another channel | Tag admin in reports | @ mention admin on reports | Send report to enterprise admins in the support app`,
  ),
  parseMap(
    "Tony",
    "Enterprise admin",
    `[Generate Reports] > Select Metrics to Report On: *Specify date range | *Select all tickets under all teams | *Select specific teams for analysis | Specific SLA | Select specific ticket type | By a specific metric (location, label, category) | Organise data by user | Compare reports across teams/departments
[Generate Reports] > Choose How to Display Data: *Basic number outputs | *Tables/spreadsheets | *Charts and graphs | *Organised by team | Separated by another metric | Dashboard | Widgets
[View Report Metrics and SLAs] > View Reports: *Per team | *Charts and graphs | Dashboard | Per category | Per member | Widgets
[Manage Metrics and SLAs] > Access Reports: *Navigate to report | *Review/compare exported data sets | *Request a set of reports from support (extra charge) | Reporting-specific UI
[Manage Metrics and SLAs] > Highlight Areas for Improvement: Capture/highlight insights | Filter and highlight data by a metric | Highlight any times support missed the SLA | Set red lines and show when crossed | Highlight notable stats
[Customise the Report View] > Choose Report View: *Navigate to report | Reporting-specific UI
[Customise the Report View] > View Specific Reports: *Quick summary of open and resolved tickets | Support sets up the dashboard | Choose from common dashboard templates | Customise layout from a preset | Customise the dashboard layout freely
[View Report Backlog] > View Backlog of Outstanding Tickets: Filter by outstanding tickets | Go to a backlog view
[View Report Backlog] > Assess Backlog for Urgent Tickets: Filter by urgent tickets | *Urgent tickets appear at the top
[View Report Backlog] > Push Up Priority: *Update ticket priority/urgency | *Update/edit priority level | Prompt a reminder to support | Take control of the ticket (assign to self) | Mark as blocking (urgent to continue work)
[Export Report Data for Analysis/Audits] > Generate Report: *Specify date range | *Select all tickets under team | Organise data by user | By a specific metric | Specific SLA | By location, label or category | Select specific ticket type | Compare reports across teams/departments
[Export Report Data for Analysis/Audits] > Review Report: Preview final report | Check all desired data is included | Check filters are right (date range, team, user) | View summary of report | View highlights of report | AI scan and summary of the report
[Export Report Data for Analysis/Audits] > Export Report: *Export as XLS/CSV | *Basic number outputs | *Charts and graphs | *Tables/spreadsheets | Dashboard | Widgets | Bulk export reports | Export a specific section of data | Live link to a spreadsheet | Export as PDF | Export as raw data`,
  ),
];

// The Order of Execution board: each direction's score (how many objectives it
// meets) and effort out of 10, in the order they were planned, with what
// happened to it in the end. Popover panels and guided tours were never scored.
type Direction = Extract<Block, { type: "priorities" }>["items"][number];
const d = (title: string, value: number | undefined, effort: number, status: Direction["status"], note?: string): Direction => ({
  title,
  value,
  effort,
  status,
  note,
});
export const supportPriorities: Direction[] = [
  d("Feature requests", 15, 7, "Shipped"),
  d("Report a bug", 11, 6, "Shipped"),
  d("Help centre", 15, 9, "Shipped", "Built by another team"),
  d("Demos", 10, 4, "Partly", "Easier demos, few videos"),
  d("Tooltips", 8, 2, "Shipped", "Added every sprint"),
  d("UX and UI issue reports", 10, 7, "Partly", "Folded into bug reports"),
  d("Clearer error messages", 7, 3, "Shipped", "Built by developers"),
  d("Personalised five-step getting started guides", 10, 8, "Not built"),
  d("Popover panels with documentation for that screen", undefined, 8, "Not built"),
  d("In-app decision tree to triage problems", 8, 6, "Designed", "Cut from the MVP"),
  d("Demo documents and templates", 6, 2, "Not built"),
  d("Guided tours", undefined, 6, "Shipped"),
  d("Custom documentation packs", 6, 8, "Cut", "Too much manual work"),
  d("Keyboard shortcuts", 4, 4, "Shipped", "In the editor"),
  d("External and community help", 7, 10, "Not built"),
];

// The same directions, in the four themes discovery sorted them into.
const status = (title: string) => {
  const it = supportPriorities.find((x) => x.title === title);
  if (!it) throw new Error(`No direction called ${title}`);
  return { title, status: it.status };
};
export const supportThemes: Extract<Block, { type: "themes" }>["items"] = [
  {
    title: "Contextual help",
    body: "Help that appears where you are in the app.",
    directions: [
      status("Tooltips"),
      status("Guided tours"),
      status("Keyboard shortcuts"),
      status("Popover panels with documentation for that screen"),
    ],
  },
  {
    title: "Custom documentation",
    body: "Help shaped around who you are and what you do.",
    directions: [
      status("Demos"),
      status("Personalised five-step getting started guides"),
      status("Demo documents and templates"),
      status("Custom documentation packs"),
    ],
  },
  {
    title: "Self-service",
    body: "Finding the answer yourself, before you need a person.",
    directions: [
      status("Help centre"),
      status("Clearer error messages"),
      status("In-app decision tree to triage problems"),
      status("External and community help"),
    ],
  },
  {
    title: "Feedback",
    body: "Telling us what's broken or missing, from inside the product.",
    directions: [status("Report a bug"), status("Feature requests"), status("UX and UI issue reports")],
  },
];

// The objectives table on the planning board. Each objective is weighted out
// of 10; `meets` lists the directions (by index) that meet it.
const tooltips = 0, helpCentre = 1, errors = 2, tickets = 3;
export const supportObjectives: Pick<Extract<Block, { type: "objectives" }>, "directions" | "items"> = {
  directions: ["Tooltips", "Help centre", "Clearer error messages", "Ticket monitoring"],
  items: [
    { objective: "Increase brand loyalty", weight: 5, meets: [helpCentre, tickets] },
    { objective: "Increase brand recognition", weight: 6, meets: [helpCentre] },
    { objective: "Build brand trust", weight: 6, meets: [helpCentre, tickets] },
    { objective: "Reduce churn", weight: 9, meets: [tooltips, errors] },
    { objective: "Help users move from the old app to Console", weight: 4, meets: [tooltips, helpCentre] },
    { objective: "Increase retention", weight: 8, meets: [helpCentre, tickets] },
    { objective: "Upsell to more personas", weight: 5, meets: [helpCentre] },
    { objective: "Improve the user experience", weight: 8, meets: [tooltips, helpCentre, errors, tickets] },
    { objective: "Create more capable advanced users", weight: 5, meets: [helpCentre] },
    { objective: "Scalability", weight: 7, meets: [tooltips, helpCentre, errors, tickets] },
    { objective: "Increase security", weight: 8, meets: [errors, tickets] },
    { objective: "Free up time for more valuable work", weight: 8, meets: [tooltips, helpCentre, errors, tickets] },
    { objective: "Increase productivity", weight: 6, meets: [errors, tickets] },
    { objective: "Reduce the load on support", weight: 4, meets: [tooltips, helpCentre, errors, tickets] },
    { objective: "Meet accessibility standards (AA)", weight: 10, meets: [tooltips, helpCentre] },
    { objective: "UK enterprise conversions", weight: 10, meets: [helpCentre, tickets], top: true },
    { objective: "Embed Legalesign in how organisations work", weight: 8, meets: [] },
    { objective: "Give enterprise users KPIs and stats", weight: 9, meets: [tickets], top: true },
    { objective: "Show Legalesign is meeting its SLA", weight: 9, meets: [tickets], top: true },
    { objective: "Encourage exploring advanced workflows", weight: 6, meets: [tooltips, helpCentre] },
    { objective: "Cover more of every user's workflow", weight: 4, meets: [] },
    { objective: "Encourage more integrated workflows", weight: 7, meets: [] },
    { objective: "Capture API customers", weight: 8, meets: [helpCentre] },
  ],
};
