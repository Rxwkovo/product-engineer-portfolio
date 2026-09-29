# Product presentation decisions

The pages follow a product presentation sequence: a large introduction, one scroll-driven story, a real interactive demo, then scope and provenance. Motion explains a change in the product rather than decorating every section. Scrolling remains native; there is no scroll interception or external animation library.

- **Forma:** words recede into editable fields; open questions remain visible; a confirmation mark introduces human ownership. The real demo preserves the original request, edits and saved review notes.
- **Prism:** a comparison wipe reveals a clean fictional table, followed by illustrative rule counts. The actual working report uses separate pipeline data; illustration counts are not represented as pipeline results.
- **Code Pet:** the companion shifts to make room for detail, then shrinks back so focus returns to the workspace. The real interactive prototype offers explicit states and stale-data handling.

Scroll progress uses requestAnimationFrame interpolation and stops scheduling when settled. Animations affect transforms/opacity or a small isolated illustration. Reduced-motion mode removes the pinned scroll sequence and exposes all three chapters as static content. Code Pet also offers an explicit Reduce motion switch. Viewports shorter than 600 pixels use a complete static story so chapters cannot be clipped by a pinned scene. Expanded/compact details retain their width during transitions on phones as well as desktop; only their presentation moves. No automatic carousel, autoplay media or forced scroll is used.

Body and small text use locally bundled Bricolage Grotesque. Original heading families and weight remain. Product hero scale was increased for the newly requested presentation format.

## Review performed

- JavaScript syntax checked after introducing the shared motion implementation.
- Forma local parser, editable date, saved human answer, confirmation JSON reviewed in the browser.
- Prism sample processed through the Python endpoint: 11 input rows, 10 output rows, one duplicate, three missing cells filled, 10 dates converted, one text cell trimmed, zero unparseable dates.
- Code Pet expand/collapse and mood/stale states reviewed in the browser.
- 390-pixel iframe layout reviewed visually; Forma document content width fits its viewport. Browser viewport emulation did not apply on this host, so the narrow embedded viewport was used for that check.
- The live AI model path requires a server key and has not been exercised. Static public Prism uses a bundled output produced by the Python pipeline and cannot accept arbitrary uploaded files.


## Northstar route refinement

The existing Sites Northstar initially used the older Bootstrap-based layout. It now refines the user-provided route concept: the same route metaphor, mist blue, navy and amber, with adjusted typography, spacing, borders, navigation clearance and motion timing. A sample workspace offers Discover / Build / Launch stages with illustrative tasks and decisions. No real project data is saved. The earlier starter's MIT license remains as provenance; the new page does not load Bootstrap.

Review evidence: the desktop hero and Build scroll chapter were inspected in the browser; route progress and chapter text changed together. All three workspace phases rendered their corresponding tasks and decision. The right-arrow key moved focus/selection from Discover to Build. Dark mode changed the body background to the intended navy. The explicit Reduce motion preference exposed all three chapters at opacity 1 with no aria-hidden and removed sticky positioning. JavaScript syntax was checked. The 390-pixel embedded phone layout had a 375-pixel content viewport and equal document width, with no horizontal overflow. Embedded-frame menu clicks were unavailable through this browser connection, so phone menu operation was not verified. No live customers, commercial metrics or transaction flow are represented.


## Front-facing product frames

Code Pet, Forma and Prism now use horizontal, front-facing frames in their heroes and scroll stories. Perspective and panel rotation were removed, including the Forma paper-stack and confirmation rotation. Translation, scaling, field reveal, comparison wipe and return-to-focus motion are retained.

Browser review confirmed no perspective on all three hero/story parents and no off-axis rotation in their product-frame transforms. Forma paper-stack elements also reported transform none. Three covers and the Forma/Prism hero captures were refreshed from the actual local static pages.
