import '../node_modules/bootstrap/dist/js/bootstrap.js'

import {Page, PageContent} from "./page.js"

let page: Page = new Page([
    new PageContent("about", "About Me", "#about-page-content"),
    new PageContent("career", "Career History", "#career-page-content"),
    new PageContent("projects", "My Projects", "#projects-page-content"),
    new PageContent("resume", "Resume", "#resume-page-content"),

]);