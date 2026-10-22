// Getting Unstuck's research: the six personas, the three story maps and how
// the help directions were ranked. Used by its project page (src/projects.ts).

import type { Block, PersonaCard, StoryMap, StoryTasks, UserStories } from "./projects";

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
function parseTasks(raw: string, from: StoryTasks = []): StoryTasks {
  const tasks: StoryTasks = [];
  const task = (title: string) => {
    let t = tasks.find((x) => x.title === title);
    if (!t) tasks.push((t = { title, steps: [] }));
    return t;
  };
  for (const line of raw.trim().split("\n")) {
    if (line.startsWith("@")) {
      const [title, step] = line.slice(1).split(" > ");
      const src = from.find((x) => x.title === title);
      const steps = src?.steps.filter((x) => !step || x.title === step);
      if (!steps?.length) throw new Error(`No step to copy for ${line}`);
      task(title).steps.push(...steps);
      continue;
    }
    const m = line.match(/^\[(.+?)\] > (.+?): (.+)$/);
    if (!m) continue;
    const [, title, step, rest] = m;
    task(title).steps.push({
      title: step,
      stories: rest.split(" | ").map((s) => (s.startsWith("*") ? { text: s.slice(1), mvp: true } : { text: s })),
    });
  }
  return tasks;
}
const parseMap = (persona: string, label: string, cut: string, full: string): StoryMap => {
  const c = parseTasks(cut);
  return { persona, label, cut: c, full: parseTasks(full, c) };
};

// The full maps, before the cut. A line starting with @ copies a task (or one
// "Task > Step") from the persona's cut-down map, where it carried over as is.
const fullTaylor = `@Create Support Enquiry
@Track a Support Ticket
@Escalate Ticket Priority > Select Ticket
[Escalate Ticket Priority] > Edit Ticket Details: Make an edit to the ticket | Add details and uploads | Drill into the ticket to make an edit | Edit the ticket from the list | Save edits
@Escalate Ticket Priority > Increase Priority Level of Ticket
@Support Ticket Updates
[Provide More Details on an Issue] > Add Extra Information to Ticket: Drill into the ticket to add more information | Add information in the ticket thread
[Provide More Details on an Issue] > Save and Send Updated Information: Send directly to support | Send to internal management | Get approval from management
[Track Progress of All Open Tickets] > Navigate to Ticket Listings: *Navigate to ticket listings
[Track Progress of All Open Tickets] > Select How to View all Tickets: *Select List view | Select Dashboard view | Select ticket display view (Dashboard, Overview, List, Kanban)
[Track Progress of All Open Tickets] > Filter Tickets by Open/Closed Status: Filter by open or closed status
[Track Progress of All Open Tickets] > Sort Open Tickets by Progress: Sort by progress status (pending, in progress, blocked, done) | View tickets grouped by progress
@Track Progress of All Open Tickets > View Progress Status
@Check Recently Resolved Tickets
[Give Feedback on a Solution] > Give Feedback on the Ticket: Rate how well the solution worked | Update the ticket with new information | Leave a review
[Give Feedback on a Solution] > Send Feedback to Those Involved: Tell support how well the solution worked
@Mark Success of Ticket
@Check Previously Resolved Inquiries
@Open a New Ticket From a Previous Issue
[Compare Similar Tickets and Solutions] > Find Similar Tickets: Search by issue tag/category | Filter by issue location | Search by URL | Search by issue title | Search by issue description | Find similar issues using AI
[Compare Similar Tickets and Solutions] > Review & Compare Tickets: Open ticket details in new tabs | Open tickets side by side | Reveal several tickets' details from the list
[Link Related Tickets] > Locate Similar Ticket: Search by issue tag/category | Filter by issue location | Search by URL | Search by issue title | Search by issue description | Find similar issues using AI
[Link Related Tickets] > View Ticket(s): Enter ticket | Preview ticket details
[Link Related Tickets] > Link Ticket(s): Add several tickets to a category or label | Select several and link them in one action | Copy reference code | Paste the reference code into a related ticket | Mark a similar ticket as linked | Search inside a ticket for similar ones
[Link Related Tickets] > View Linked Tickets: Drill into the parent ticket | Filter by category or label | Search inside a ticket for linked tickets | Linked or grouped view
[Organise Support Tickets] > Label Support Tickets: Give tickets a label | Create a ticket category | Create categories automatically from a metric (e.g. satisfaction rating)
[Organise Support Tickets] > View Categorised Tickets: Filter tickets by category/label | Select ticket display view (Dashboard, Overview, List, Kanban)`;

const fullOlivia = `[Edit Team Notification Settings] > Open Notification Settings: Navigate to settings
[Edit Team Notification Settings] > Set Up Notification Preferences: Choose how to receive notifications | Get notified of urgent updates only | Get notified of every update | Get notified when a ticket's status changes | Send all notifications to one place (email) | Receive or mute notifications for specific actions | Receive or mute notifications for specific users
[Edit Team Notification Settings] > Receive Chosen Notifications: Email | Toasts | In-app notification centre | Send chosen notifications to a specific place | Alert indicator in the UI | Another app (e.g. Slack) | Phone | Text message
[Control Team Support Permissions] > Open User Permissions: Navigate to team permissions | Go to user permissions from a link in a notification
[Control Team Support Permissions] > Select User: Scroll through users | Select one user | Search for a user | Sort users | Filter users | Select several users
[Control Team Support Permissions] > Update Permission Settings: Change a user's support access level | Update permissions in bulk | Ask the enterprise admin to grant access to a blocked user
[Customise Ticket Preset Options] > View Ticket Preset Options: Navigate to ticket preferences
[Customise Ticket Preset Options] > Set Up Custom Labels and Categories: Add a label name | Choose from recommended label groups | Describe how to use each label | Create label sets (e.g. size, or where in the app) | Set label colour | Set label icon | Make certain label sets required
[Customise Ticket Preset Options] > Save Customisations: Save to your own team | Publish to the organisation | Publish to chosen teams
@View/Track All Team Tickets in One Place
[Bulk Manage Team Tickets] > Select Tickets: Select several tickets by hand | Select all tickets sharing a priority or status | Select several tickets at once
[Bulk Manage Team Tickets] > Complete Bulk Actions: Bulk reminders | Bulk escalate | Bulk update | Link tickets | Bulk remove | Bulk group | Merge tickets into one | Bulk clone
[Bulk Manage Team Tickets] > Get Confirmation: See that the action is complete | Receive in-app notification | Receive an email of the actions | See the action in an audit log | Receive notification in another app (e.g. Slack)
@Follow Up on Blocking/Urgent Issues
@Escalate on Behalf of a Team Member
[Step In on a Team Member's Ticket] > Find Issues That Need Help: Get notified when an SLA is breached | Find tickets to escalate | Get notified by team members
[Step In on a Team Member's Ticket] > Add Help to the Ticket: Give internal support | Assign the ticket to an advanced user | Link resources to the issue | Add to the ticket thread | Link similar past or current tickets
[Step In on a Team Member's Ticket] > Save Additions: Save updates
[Assign a Ticket to a Team Member] > Assess the Issue: Expand ticket details | Read ticket thread | Read ticket log | View preview of tickets | View summary of tickets
[Assign a Ticket to a Team Member] > Check Who Raised It: View the team member's ticket
[Assign a Ticket to a Team Member] > Assign to an Advanced User: Search for a team member | @ mention a team member
@Change Ticket Listings View
[Customise the Ticket Dashboard] > Choose What to Highlight: High-impact issues by urgency | Organise by status | Organise by label/category | Set a date range | Pick stats and metrics to focus on | Set an SLA | Pick team members
[Customise the Ticket Dashboard] > Add Widgets: Choose from a fixed set | Choose widgets the enterprise admin made | Choose from recommendations for the data | Choose from AI recommendations | Choose charts and graphs
[Customise the Ticket Dashboard] > Edit Widgets: Edit existing widgets | Rearrange the layout | Resize widgets
[Customise the Ticket Dashboard] > Save Custom Settings: Save new settings | Apply settings to the existing dashboard | Save widgets as presets | Save the dashboard as a preset
[Customise the Ticket Dashboard] > Share the Set-up: Share with all team members | Share with chosen team members | Offer the widget as a preset across teams
@Review Updated Tickets
[Contribute to Updated Tickets] > Edit Ticket Info: Drill into the ticket to edit | Edit title | Edit description | Edit labels | Edit category/type label | Edit uploads | Edit logs/error codes | Edit automated escalation rules | Edit the ticket from the list
[Contribute to Updated Tickets] > Add More Details: Add labels | Add details and uploads | Add links | Add a comment | Add logs/error codes | Link similar tickets across teams | Apply automated escalation rules
@Check Resolved Enquiries Across Teams
@Compare Similar Tickets Across Teams
[Link Related Tickets Across Teams] > Locate Similar Ticket: Search by issue title | Search by issue description | Search by issue tag/category | Filter by issue location | Search by URL | Find similar issues using AI
[Link Related Tickets Across Teams] > View Ticket(s): Enter ticket | Reveal more ticket details from the list | Preview ticket details
[Link Related Tickets Across Teams] > Link Ticket(s): Add several tickets to a category or label | Select several and link them in one action | Copy reference code | Paste the reference code into a related ticket | Mark a similar ticket as linked | Search inside a ticket for similar ones
[Link Related Tickets Across Teams] > View Linked Tickets: Filter by linked tickets | View tickets in a linked or grouped view | Search inside a ticket for linked tickets
[Organise Support Tickets] > Categorise Tickets: Assign a type or label | Create a ticket category | Assign to a team member | Create categories automatically from a metric (e.g. satisfaction rating)
[Organise Support Tickets] > View Categorised Tickets: Filter tickets by category/label | Separate tickets per team member | Select ticket display view (Dashboard, Overview, List, Kanban)
@Analyse Support Performance
@Export Reports`;

const fullTony = `[Control Team Support Access] > View All Team Members: See all members across the organisation's teams | Scroll through members | Search team members | See members grouped by team
[Control Team Support Access] > Set Permission per Member: Change each member's permission individually | Set permissions for several members at once
[Set Up Integrations With Other Tools] > Choose Integration: View possible integrations | Request an integration from support | Integrate using a third-party tool
[Set Up Integrations With Other Tools] > Set Up Integration: Follow the set-up documentation | Hire Legalesign to set it up | Set up integration rules and conditions | Test the integration | Get a tailored set-up plan from AI
[Customise the Ticket Form] > Access Ticket Preferences: Navigate to ticket preferences
[Customise the Ticket Form] > Set Up a Custom Ticket Form: Make specific fields required | Remove input options (e.g. block screenshots for security) | Create custom label options | Create custom field options | Customise the ticket layout | Add and remove field options from presets
[Customise the Ticket Form] > Save the Form to Teams: Save the form as a preset | Save the form to specific teams | Save as suggested or mandatory | Save the form to specific users
[Create Ticket Automation Rules] > Access Automation Preferences: Navigate to automation preferences | Request automation access from support | Add automation to your plan
[Create Ticket Automation Rules] > Define Automation Rules: Escalation automation | Reminder automation | Escalate after a set time | Notify support after a set time | Notify me or admins after a set time | Ask support to set up automations | When an SLA is missed, act on it | Quarterly or annual checks
[Create Ticket Automation Rules] > Confirm the Rules: Visual indicator in the UI | In-app success notification | Send the confirmation to my email | Trial with a dummy ticket | Test rules in a sandbox
[Create Report Presets for Metrics and SLAs] > Access Report Set-up: Navigate to report settings | Request reporting access from support | Add reporting to your plan
[Create Report Presets for Metrics and SLAs] > Select Metrics to Report On: Select all tickets under the team | Specify date range | Select specific ticket type | Organise data by user | Select specific teams | Select a time period | By a specific metric | Specific SLA
[Create Report Presets for Metrics and SLAs] > Set Report Terms: Specify date range | By a specific metric (e.g. only when the SLA is missed) | Organise data by user
[Create Report Presets for Metrics and SLAs] > Choose How to Display Data: XLS/CSV | PDF | Table | Graph or chart
[Create Report Presets for Metrics and SLAs] > Save Preset: Save as an export option | Create it automatically on a schedule (e.g. every quarter, to my email) | Save as a widget
@Generate Reports
@View Report Metrics and SLAs
@Manage Metrics and SLAs
[Manage Metrics and SLAs] > Escalate Areas to Support: Send a section of a report to support | Alert support automatically when a red line is near or crossed
[Manage Metrics and SLAs] > Follow Up: Send a report as a ticket | Chat thread on reports | Highlight and comment on parts of a report for support to answer
@Customise the Report View
@View Report Backlog
[Bulk Ticket Management] > Find Tickets: Search by issue tag/category | Filter by issue location | Search by URL | Search by issue title | Search by issue description | Find similar issues using AI
[Bulk Ticket Management] > Select Several Tickets: Select tickets by hand | Select all tickets sharing a priority or status | Select several tickets at once | Select everything a search or filter returns
[Bulk Ticket Management] > Act on the Selection: Bulk update | Bulk remove | Bulk group | Bulk reminders | Link tickets | Merge tickets into one | Bulk escalate | Bulk clone
@Export Report Data for Analysis/Audits`;

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
    fullTaylor,
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
    fullOlivia,
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
    fullTony,
  ),
];

// The Order of Execution board: each direction's score (how many objectives it
// meets) and effort out of 10, in the order they were planned, with what
// happened to it in the end. Popover panels and guided tours weren't scored at
// the time, so they were scored against the same objectives for this page.
// Feature requests, UX and UI reports, demos, the decision tree, demo
// templates, keyboard shortcuts and community help were rescored in review
// (notes/getting-unstuck-scoring-review.md): feature requests and UX reports
// share the bug report form, so they cost little once it exists.
type Direction = Extract<Block, { type: "priorities" }>["items"][number];
const d = (title: string, value: number | undefined, effort: number, status: Direction["status"], note?: string): Direction => ({
  title,
  value,
  effort,
  status,
  note,
});
export const supportPriorities: Direction[] = [
  d("Feature requests", 9, 3, "Shipped"),
  d("Report a bug", 11, 6, "Shipped"),
  d("Help centre", 15, 9, "Shipped", "Built later on the roadmap"),
  d("Demos", 10, 6, "Partly", "Easier demos, few videos"),
  d("Tooltips", 8, 2, "Shipped", "Added every sprint"),
  d("UX and UI issue reports", 8, 2, "Partly", "Folded into bug reports"),
  d("Clearer error messages", 7, 3, "Shipped", "Built by developers"),
  d("Personalised five-step getting started guides", 10, 8, "Not built"),
  d("Popover panels with documentation for that screen", 10, 8, "Not built", "Scored for this page"),
  d("In-app decision tree to triage problems", 8, 8, "Designed", "Cut from the MVP"),
  d("Demo documents and templates", 7, 5, "Not built"),
  d("Guided tours", 9, 6, "Shipped", "Scored for this page"),
  d("Custom documentation packs", 6, 8, "Cut", "Too much manual work"),
  d("Keyboard shortcuts", 6, 4, "Shipped", "In the editor"),
  d("External and community help", 8, 10, "Not built"),
];

// The same directions, in the four clusters discovery sorted them into.
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
    title: "Documentation",
    body: "Guides, demos and templates to learn from.",
    directions: [
      status("Demos"),
      status("Personalised five-step getting started guides"),
      status("Demo documents and templates"),
      status("Custom documentation packs"),
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
  directions: ["Tooltips", "Help centre", "Clearer error messages", "Ticket tracking"],
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

// The four shortlisted directions, totalled from the objectives table.
const totals = (d: number) => {
  const met = supportObjectives.items.filter((it) => it.meets.includes(d));
  const top = supportObjectives.items.filter((it) => it.top);
  return [
    { label: "Objectives met", value: `${met.length} of ${supportObjectives.items.length}` },
    { label: "Weighted score", value: String(met.reduce((n, it) => n + it.weight, 0)) },
    { label: "Top priorities met", value: `${met.filter((it) => it.top).length} of ${top.length}` },
  ];
};
export const supportShortlist: Extract<Block, { type: "shortlist" }>["items"] = [
  { title: "Ticket tracking", tag: "Built first, by me", stats: totals(tickets), chosen: true },
  { title: "Help centre", tag: "Later on the roadmap", stats: totals(helpCentre) },
  { title: "Tooltips", tag: "Added every sprint", stats: totals(tooltips) },
  { title: "Clearer error messages", tag: "Built by the developers", stats: totals(errors) },
];

// The user stories behind each map, grouped by feature as they were on the
// planning board. A leading * marks a story kept for the MVP; the rest were
// greyed out. These became the tickets the developers built from.
function parseStories(persona: string, label: string, raw: string): UserStories {
  const groups: UserStories["groups"] = [];
  for (const line of raw.trim().split("\n")) {
    if (line.startsWith("# ")) groups.push({ title: line.slice(2), stories: [] });
    else if (line.startsWith("* ")) groups.at(-1)!.stories.push({ text: line.slice(2), mvp: true });
    else if (line.startsWith("- ")) groups.at(-1)!.stories.push({ text: line.slice(2) });
  }
  return { persona, label, groups };
}

export const supportUserStories: UserStories[] = [
  parseStories(
    "Taylor",
    "Daily user",
    `# Notifications and alerts
* As a Daily User, I want to receive notifications for any updates or changes in the ticket status, so I can stay informed without manual checks.
* As a Daily User, I want to receive notifications for any updates or changes in the status of my support tickets, so I can stay informed in real time.
# Email and chat integrations
* As a Daily User, I want the dashboard to integrate with communication tools like email and chat for seamless updates on ticket progress, so I can keep clear communication with the support team.
* As a Daily User, I want the dashboard to integrate with email to sync communication about support tickets, so all the information is in one place.
- As a Daily User, I want integration with messaging tools like Slack to streamline communication about ticket updates and resolutions.
# Search and filtering
- As a Daily User, I want the dashboard to include a search function so I can quickly find specific support tickets.
- As a Daily User, I want to search and filter the dashboard by keywords or criteria, so I can quickly locate specific tickets or inquiries.
- As a Daily User, I want to filter support tickets by date, category or priority to focus on relevant tasks.
# Ticket display
* As a Daily User, I want a visual representation of ticket statuses (e.g. colour-coded indicators) for quick identification and prioritisation.
# Live ticket status
* As a Daily User, I want a visual dashboard displaying key metrics and pending tickets.
* As a Daily User, I want the dashboard to provide real-time updates on ticket statuses and resolutions, so I always have the latest information.
* As a Daily User, I want real-time updates on ticket resolutions and response times, so I can track progress and anticipate when tickets will be resolved.
* As a Daily User, I need a clear overview of all open tickets and their current status, so I can quickly see which tickets need my attention.
* As a Daily User, I want to easily track the status of all the support tickets I've raised, including pending, in progress and resolved.
# A simple dashboard
* As a Daily User, I value a user-friendly interface to view and track my open tickets.
* As a Daily User, I want to easily track the status of every support ticket I've submitted, so I can follow up as needed.
# Organising and prioritising
- As a Daily User, I want to categorise and prioritise my support tickets by urgency, department or issue type, for better organisation.
- As a Daily User, I want to categorise tickets by their nature (e.g. technical issue, general inquiry) for better organisation and prioritisation.
- As a Daily User, I want multiple ticket views, such as a list, a Kanban board or a calendar.
# Ticket history
* As a Daily User, I want a history log of ticket actions and communications for reference and audit purposes.
* As a Daily User, I want to track my submitted tickets in real time, get notified of updates, and see a history of the actions taken on each one.
# Self-service resources
- As a Daily User, I want a knowledge base or FAQ section for common issues, so I can troubleshoot without depending on support.
- As a Daily User, I want easy access to support resources, for a seamless self-service experience.
# Rating solutions
- As a Daily User, I want a way to rate how effective the solution to each ticket was.
- As a Daily User, I want to rate the resolution of my tickets, so my line manager (the Team Admin) knows how effective the solutions are.
# Creating a ticket
* As a Daily User, I want to create a ticket and fill out its details in a form, to capture the information relevant to my support request.
- As a Daily User, I want to create custom ticket fields to capture information specific to different types of support request.
# Collaboration
- As a Daily User, I want to add notes or comments to support tickets to give more context or updates.
- As a Daily User, I want to attach relevant documents or notes to individual tickets for full context.
- As a Daily User, I need to attach files, screenshots and screen recordings to individual tickets for full context.
- As a Daily User, I want to collaborate with team members within tickets, leaving comments and sharing updates.
# Escalations
* As a Daily User, I want to prioritise tickets by urgency and their impact on my work, so I can escalate the right ones to my admin or follow up with support.
- As a Daily User, I need to set up automated escalations for unresolved tickets to ensure they're resolved in time.`,
  ),
  parseStories(
    "Olivia",
    "Team admin",
    `# Search and filtering
- As a Team Admin, I want to filter tickets by priority level for efficient handling.
- As a Team Admin, I want to filter tickets by category (e.g. type, status, urgency) for better organisation.
- As a Team Admin, I want to filter tickets by specific criteria for targeted analysis.
- As a Team Admin, I want to create custom filters for ticket data to analyse specific trends or issues.
# Categorising
- As a Team Admin, I want to categorise support tickets by urgency to prioritise resolution.
- As a Team Admin, I want a customisable ticket categorisation system to organise support tickets effectively.
- As a Team Admin, I want tickets organised automatically by keywords or categories for efficient handling.
# Prioritisation
* As a Team Admin, I want to set priority levels for support tickets to ensure critical issues are addressed promptly.
* As a Team Admin, I want to set priority levels for tickets based on urgency to ensure critical issues are addressed promptly.
# Access control
- As a Team Admin, I want user-specific access controls on the dashboard to maintain data security and privacy.
- As a Team Admin, I want ticket tracking tied to user permissions to control access.
# SLA and escalation rules
- As a Team Admin, I want tickets prioritised automatically against the SLA to streamline resolution.
- As a Team Admin, I want to create customisable ticket escalation rules based on priority levels.
- As a Team Admin, I want automated escalations based on ticket age or unresolved status.
- As a Team Admin, I want SLA reminders and escalations for overdue tickets.
# Collaboration
- As a Team Admin, I want team members to add notes and updates to tickets for collaboration.
- As a Team Admin, I want collaboration features in the dashboard to share knowledge on ticketed issues.
# Notifications and alerts
* As a Team Admin, I want to be notified of new tickets from my team members to ensure prompt attention.
* As a Team Admin, I want real-time notifications for critical updates or escalations on my team's tickets.
* As a Team Admin, I want to be notified of all overdue support tickets so I can act on them.
- As a Team Admin, I want automated notifications for ticket updates and escalations to keep stakeholders informed.
- As a Team Admin, I want automated notifications for critical ticket updates to ensure timely responses.
- As a Team Admin, I want automated alerts for critical ticket statuses.
- As a Team Admin, I want automated reminders for unresolved tickets to ensure timely follow-up.
# Reporting
* As a Team Admin, I want reports on ticket resolution rates, response times and trends for performance analysis.
* As a Team Admin, I want to export ticket data for further analysis, or to share with stakeholders.
- As a Team Admin, I want reports on ticket trends to identify recurring issues.
- As a Team Admin, I want to schedule automated ticket reports for regular updates.
# Email and Slack integrations
* As a Team Admin, I want ticket tracking connected to email for seamless communication and updates.
- As a Team Admin, I want ticket tracking connected to tools like Slack for seamless collaboration.
- As a Team Admin, I want real-time collaboration on ticket resolutions within the dashboard.
# Ticket tracking
* As a Team Admin, I want to easily track the status of all my team members' support tickets to ensure timely resolution.
* As a Team Admin, I want to track the status of support tickets in real time.
* As a Team Admin, I want to track the status of escalated tickets.
* As a Team Admin, I want to track resolution times and response rates to ensure service level agreements are met.
# The team dashboard
* As a Team Admin, I want a central dashboard showing real-time ticket status and how tickets are spread across the team.
* As a Team Admin, I want a dashboard overview showing ticket volume and resolution status.
* As a Team Admin, I want an overview of key ticket metrics like open tickets, resolved tickets and average resolution time.
* As a Team Admin, I want a visual representation of ticket statuses for quick monitoring.
* As a Team Admin, I want to view a summary of open and closed support tickets.
- As a Team Admin, I want a dashboard view of ticket trends and patterns for proactive support.
- As a Team Admin, I want to track each team member's ticket resolution rate.
- As a Team Admin, I want to see ticket volume by team or urgency level.
# Customising the dashboard
- As a Team Admin, I want customisable dashboard widgets showing ticket trends and performance metrics.
- As a Team Admin, I want custom dashboards with key ticket metrics for different team members or departments.
- As a Team Admin, I want to customise the dashboard to show metrics like resolution rate and average response time.
- As a Team Admin, I want to arrange the dashboard so the most relevant ticket metrics come first.
# Ticket structure
- As a Team Admin, I want to customise ticket status labels for better tracking.
- As a Team Admin, I want templates for common ticket types to streamline ticket creation.
- As a Team Admin, I want custom ticket fields to capture specific information for each ticket.
# Ticket history
* As a Team Admin, I want to track the history of ticket updates and resolutions for auditing purposes.`,
  ),
  parseStories(
    "Tony",
    "Enterprise admin",
    `# Customising the dashboard
- As an Enterprise IT Administrator, I need customisable widgets for personalised views and quick access to critical ticket information.
- As an Enterprise IT Administrator, I need customisable views for different stakeholders, with role-based access for different team members.
# Ticket status across teams
* As an Enterprise IT Administrator, I need insights into common ticket categories.
* As an Enterprise IT Administrator, I want a dashboard with real-time updates on the status of support tickets and inquiries across teams.
* As an Enterprise IT Administrator, I want to track the status of support tickets in real time to monitor progress.
* As an Enterprise IT Administrator, I need real-time updates on ticket statuses, and the ability to escalate.
* As an Enterprise IT Administrator, I need a summary of open and resolved tickets.
* As an Enterprise IT Administrator, I need a summary of ticket statuses, including open, pending, resolved, closed and overdue.
# Bulk ticket management
- As an Enterprise IT Administrator, I want bulk actions on support tickets for efficient management.
# Time tracking
* As an Enterprise IT Administrator, I want to track the average resolution time to ensure efficient responses and resolutions.
* As an Enterprise IT Administrator, I need to see how long tickets have been open, to prioritise by age.
# Reporting
* As an Enterprise IT Administrator, I want reports on response times, resolution rates and overall support performance.
- As an Enterprise IT Administrator, I want reports on ticket trends and historical patterns to identify recurring issues.
- As an Enterprise IT Administrator, I want customisable reporting on ticket performance, metrics and KPIs.
- As an Enterprise IT Administrator, I need insights on ticket volume trends and peak support hours.
- As an Enterprise IT Administrator, I want to track ticket escalations and how critical issues are handled.
- As an Enterprise IT Administrator, I expect customisable reporting templates to track SLA compliance and performance.
# Exporting
* As an Enterprise IT Administrator, I want to export ticket data for further analysis or reporting.
* As an Enterprise IT Administrator, I require exports of the data for further analysis or audits.
# Search and filtering
- As an Enterprise IT Administrator, I want to filter and prioritise tickets by urgency, priority, team or other criteria.
- As an Enterprise IT Administrator, I want support tickets prioritised by how critical they are to the business.
- As an Enterprise IT Administrator, I want to search the dashboard to quickly find specific tickets or inquiries.
# Notifications and alerts
* As an Enterprise IT Administrator, I expect to be told about critical ticket updates or escalations.
- As an Enterprise IT Administrator, I want automated alerts for high-priority tickets that need immediate attention.
- As an Enterprise IT Administrator, I want to be notified when a support ticket becomes overdue.
- As an Enterprise IT Administrator, I want integration with tools like Slack or Microsoft Teams to collaborate on ticket resolutions.
# Collaboration
- As an Enterprise IT Administrator, I want internal notes and updates on tickets for team visibility.
- As an Enterprise IT Administrator, I need comments and notes on specific tickets.
# Self-service resources
- As an Enterprise IT Administrator, I expect access to solutions and troubleshooting guides from the dashboard.`,
  ),
];
