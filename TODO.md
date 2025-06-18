# TODO

- [ ] every post should have a thumbnail (can generate via ai)
  - wide aspect ratio

- [ ] About page
- [ ] Profiles page
- [ ] references graph
  - [ ] generate it
  - [ ] render it somewhee (should be a page)

- [ ] Footer
- [ ] css for making the heading of a section stay at the top of the section when you're scrolling
  - turns out this is harder than i thoguht
- [ ] links to local posts using `[[NAME]]` syntax
- [ ] BUG: for _only_ deepest node in table of contents tree, there's no paragraph wrapped around the link??
- [ ] max height for code block (and perhaps other kinds of blocks as well)

- [x] reimplement transformations
- [x] reimplement doing the icons for URL
- [x] stylize with just black, white, and **one** accent color
  - [x] can do dark mode by just reversing use of black/white -- this is the way
  - [x] use some SVG filters to do cool visual effects for logos and titles and such
    - VETO: find another place to do cool SVG filters
    - [x] perhaps can combine with images or something for thumbnails
  - [x] do some cool distorted background that does the parallax when you scroll via javascript (turns) out CSS just can't do this quite well
    - actually, using JS is fine
- [x] fix when sometimes downloads a bad file for the icon
  - [ ] sometimes gets an empty file
- [x] for posts, instead of post title as the resource title that goes in the Top, put a hash of the content, since that looks more cool
- [x] make sure that math and other plugins are being activated
- [x] Tags page
  - [x] table on contents
- [x] PostPreview (e.g. for use in Index and Tags pages)
- [x] Index page
- [x] Header
