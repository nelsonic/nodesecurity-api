# API [![Build Status](https://travis-ci.org/nodesecurity/nodesecurity-api.png)](https://travis-ci.org/nodesecurity/nodesecurity-api) [![Dependency Status](https://david-dm.org/nodesecurity/nodesecurity-api.png)](https://david-dm.org/nodesecurity/nodesecurity-api)

This is where the Node Security Project api is going to live.

Pull requests are appreciated and contributors will be attributed at https://nodesecurity.io/contributors


## General Data Workflow

1. NPM Change Event
1. Jobsystem publishes job to check plugin
1. plugins executed
1. Plugin events created
1. Area of Interest generated
1. Area of Interest validated
1.


## Feature thoughts and considerations

- API should be decoupled from the website and other clients
-

### Users
  - Email
  - First Name
  - Last Name

### Roles
  - Type [Admin, User]
  - User

### Plugin Event
A plugin event is a paper trail that determines if a particular pattern was run against a particular module and a boolean result if something was found or not.

- Points to a area of interest if true
- Can't be deleted
- Used to build search queries on what has been checked for what module
- Shouldn't leak information about what's been found or not on a module until publish date

### Area of Interest (aoi)
A aoi is an area of interest that the machine identified needs further investigation.

- Machine user can create area of interest
- User or any role can pop a area of interest off the stack to work on
- Only Admin roles can see all area of interest
- Hotspots may not be deleted only marked into a state other than open
- Hotspots should contain the following and be ordered by timestamp (as we want users to pop the oldest one off)
  - Created date
  - UUID
  - Creator (could be a machine, could be a human)
  - area of interest description (README.md from plugin)
  - plugin title
  - relavent tech data (code, diff, etc)
  - module name
  - module version

### Communication
- If a area of interest is validated as a vulnerability it moves into the communicate stage.
- Should be able to send emails
- Should be able to recieve emails

### Comments
  - All the things should be able to have associated comments
  - Fields
    - Created On
    - author
    - comment (markdown)
    - Thing it's associated with




