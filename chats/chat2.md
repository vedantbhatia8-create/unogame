# Mobile and Desktop Layout

_Started 2026-06-04 05:55 UTC_

---

## User

for the mobile, move the screen up no one can see the cards. same with desktop

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: get_webview_logs]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: save_screenshot]_

_[tool: read_file]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: str_replace_edit]_

Found it. The device is scaled with `transform: scale()`, but the wrapper's **layout box stays full-size** (874px tall), so centering math pushes the frame down and its bottom (and your hand) falls off the bottom of the viewport. The fix is to size the wrapper to the *scaled* dimensions and scale from the top-left.

_[tool: str_replace_edit]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: save_screenshot]_

_[tool: str_replace_edit]_

Cards are visible now. Let me give the hand a bit more bottom clearance so the cards sit above the iOS home indicator instead of tucking under it.

_[tool: save_screenshot]_

Now let me verify the desktop layout fits too.

_[tool: done]_

Both layouts now fit fully within the viewport with the hand cards visible. Let me surface it and check for errors.Fixed. The problem was the device frame was scaled with `transform: scale()` but its layout box stayed full-size, so vertical centering pushed the bottom of the frame — and your hand — off the bottom of the screen. I sized the scaling wrapper to the *scaled* dimensions and now both mobile and desktop fit fully in view, with the cards sitting clear of the iOS home indicator.

