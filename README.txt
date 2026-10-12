Rustam's Goal Manager, version 5

Put ALL these files in your goal-manager GitHub repository (replace the old ones), then open the app twice so your phone picks up the update. Your data stays.
Files: index.html, style.css, engine.js, look.js, insight.js, app.js, sw.js, manifest.webmanifest, icon-192.png, icon-512.png, icon-maskable-512.png

What is new in version 3
- Plan is organised by chapter: Reading (Skim, Scan), Drafting (parts, themes, pieces) and Editing and proofreading.
- Every piece has allotted days. The clock starts when the previous piece is done (or when you press Start). Late days push everything after. Early days come back as time.
- Tick pieces done on the day you finished. Tick whole chapters or groups at once for work you did before today.
- Look: Aurora, Paper and eleven nature themes. Paper has colour, texture, dot grid, graph boxes, ruled lines, margins and sliders.
- Fixed a bug: editing or deleting a goal could change the wrong item.

What is new in version 4
- Frosted glass now works on every card, block and panel (a page animation had been switching the blur off). Fixed in the Budget Manager too.
- Nothing is drawn above the top margin of the paper.
- Daily Tasks: give a reading piece a page count and a daily pace (for example By the Sea, 246 pages, 15 a day). Log pages each day; the app shows pages left, pages needed per day against your deadline, and finishes the piece automatically when you reach the total. Skim and Scan share one pass.
- Split a drafting piece into sub-sections (for example Orientation 1/3, 2/3, 3/3), each with its own allotted days and over or under count.
- Work order now has a Custom option: choose the next piece yourself from any piece not yet done. Use "Do this next" on any piece.

What is new in version 4.1
- Editing and proofreading always come last: every editing piece in every chapter is placed after all reading and drafting for the whole thesis, and stays locked until that is done. If you already did some editing, tap the locked piece and choose "I have already done this".

What is new in version 5
- Today now shows live progress for the piece you are working on: a ring, pages done out of the total, today's pages against what you need, and the last seven days as bars.
- Work chain: a streak of days with real work. One missed day is forgiven. Leave days never break it. A few quiet milestones are shown as stars.
- Companion orb in the header. It glows when you worked today, dims when you are behind or the chain is at risk, and rests on leave days. Tap it for a short message. You can switch it off in Settings.
- The app learns how many days you really take for reading, drafting and editing. After three finished pieces of one kind it suggests new allotted days for pieces you have not started. You press a button to accept; your first deadlines stay fixed, so delays still show. You can undo it.
- Plan shows the whole chain as coloured blocks, and each chapter's progress. Outlook shows what the app has learned and your work habits (your strongest and weakest weekday).
- Your data: every entry is saved on this phone only. Settings shows how many entries there are and lets you switch off learning.
- IMPORTANT: also copy the new file insight.js into your repository.

Version 5.1: the number pad now has a decimal point, so you can log 8.5 pages.

Version 5.2
- The Circle Companion replaces the small orb. It breathes, blinks and looks around with a rhythm of its own. Hands and props appear only when needed: arms up to celebrate, a pointing hand at a chart, a magnifying glass on Outlook. It speaks rarely.
- Settings > Your data > Companion: choose Header corner, Floating (bottom right) or Off.
- IMPORTANT: also copy the new file companion.js into your repository.

Version 5.3 (new Circle Companion)
- The Companion is redesigned from Rustam's own glass prototype and merged with the expressive one: clear glass body, light-catching rim, two slow orbit rings, a soft aura.
- Adaptive ink: the outline, face and hands turn dark on light themes and white on dark themes.
- Floating mode can be dragged anywhere. It settles against the nearest side and remembers its place.
- Its eyes follow your finger when you are near it. A tap makes it squash and bounce a little.
- New poses: waving, typing on a laptop, a coffee break.
- Replace companion.js and open the app twice.

v5.4 - The new Circle Companion (same as Budget Manager v2.7)
  A living spectre or a glass orb (choose in Settings > Circle Companion), 33 shapes, lifelike props, about 90 actions,
  idle life, pokes, proverbs and tips (about 19 lines a day), soft diffused shadow and an optional cosmic aura.
  It reacts when you finish a piece, reach a 7, 30 or 100 day chain, or change screen.
  Placement: header corner, floating and snapping, or free. Always on top.
  New files: companion-art.js, companion-lines.js. The old Companion setting under "Your data" is replaced by the Companion's own card.
  Cache v5-4.

v5.5 - Daily work now shows up in the Plan
  Pages (or sub-sections) logged on a daily task now count as work done on the Plan pieces under it.
  - Each open piece shows a small bar (work done) with a mark for where the clock says you should be.
    Tap a piece to see "Work done" (for example 94 of 246 pages) and "Against the clock" (days ahead or behind).
  - Chapter and thesis bars count work done, weighted by allotted days, not only whole finished pieces.
  - If one daily task covers several pieces (Skim then Scan), its progress is shared out in clock order.
  - The finish forecast follows your real pace once a piece has been under way for two days or more, so the buffer
    grows or shrinks a little each day. The fixed deadlines do not move.
  - A piece is still marked done only when you finish it, or when its daily task reaches 100%.
  New test file: tests/work.test.js. Cache v5-5.

v5.6 - Pick, then start
  The Today screen now recommends the next pieces. A piece starts only when you press "Start this".
  - Working on: the pieces you started (two at a time is the comfortable limit; a third asks first).
  - After Start, the app asks how you want to work: a daily pace (pages or steps), sub-sections, or just the clock.
  - Waiting is not counted as late. The clock for a piece runs from the day you start it, and finishing measures the real time taken.
    Fixed deadlines do not move, so unused days still show as lost buffer in the thesis forecast.
  - "New daily task" on Today: start from the Plan (recommended pieces first), or create a task outside the Plan.
    Tasks outside the Plan do not move the thesis clock.
  - Locked pieces cannot be started; the app says why.
  - Existing data: the app switches to this mode once, at first opening. Pieces you have already logged work on count as started.
  - A started piece with no work yet can be moved back with "Stop working on this".
  New test file: tests/pick.test.js. Cache v5-6.

v5.7 - A Today panel about today's work
  The top panel of Today now starts with today's work, not the buffer:
  - Today's goal: "12 of 15 pages" with a ring. With several daily tasks it shows how many daily goals are done, with a line for each.
    The goal is your planned daily pace, or the amount you need if that is higher.
  - Your pace: the last 7 days against what you need, and your progress on the daily task.
  - Last 7 days against the 7 before, and last 30 days against the 30 before, in "plan days" (one plan day = one day of the thesis plan;
    1 a day means exactly on plan). Only the days since you began are counted.
  - Where your speed leads: the finish date at your 30-day speed (7-day speed in the first two weeks), against the year-4 target
    (11 Feb 2027) and the JRF end (11 Feb 2028).
  - Up to three short insights: behind on a deadline, a small amount left today, chain at risk, ahead or behind the clock, faster or slower week.
  - The fifth-year buffer is now a slim strip at the bottom of the panel. Tap it to open Outlook.
  New test file: tests/rhythm.test.js. Cache v5-7.

v5.8 - The Today panel is now graphic: a ring with the number inside (segmented for several tasks), up to three icon chips (chain, pace, week against week), a 14-day bar strip with a dashed goal line, a road to your target and the JRF end with a projected-finish dot, and a buffer gauge. Tap any of them and the Companion says the detail (or shows a small card if Talking is Silent).
      "Other date" in the log sheets lets you add work for a day you forgot (not in the future, not before the JRF began). It is marked "added later".
      New sounds (all under 3 seconds, made on the phone) and vibration patterns, with their own settings. A round save button sits at the bottom left. Quiet secondary buttons when a piece is already active.
      Companion: new "Avoid text" setting (Off / Gentle / Eager). It slides slowly beside text and stays there. Cache v5-8.

v5.9 - Fixes. Sounds and vibration now react when your finger lifts (Android only allows them after a finished tap), and the audio is unlocked on the first tap. "Quiet at night" is now off by default (it had silenced every sound after 10 pm); settings were reset to the new defaults. Vibration patterns are longer and stronger, and Settings has a "Feel the vibration" button with a status line. The Companion no longer jumps during a slide when a setting changes or the screen resizes. Cache v5-9.

v5.10 - New theme "Sunflower": lemon-yellow to deep golden yellow, with dark text, in light and dark mode (Settings, Aurora colours, Palette). Marigold is unchanged. Vibration patterns are back to the original gentle feel; the strength option (Light, Medium, Strong) stays. Cache v5-10.

v5.11 - The Look card is tidier: the theme tiles are smaller, four to a row, so Settings is shorter. Cache v5-11.

v5.12 - Fix: after the app's quiet one-minute refresh, the app stayed in "still" mode (no animation) until you tapped a tab. That froze the Companion, so it jumped instead of gliding. The refresh now restores the normal animation state. Cache v5-12.

v5.13 - Page icons in "Log pages read or done today": seven book-page icons with real page numbers, starting after the last page you finished (finished 113, and the row shows 114 to 120). Tap the last page you reached and all pages up to it light up; the amount fills in itself. "Last finished: N · change" sets where you are (a note, never counted as work today). The Companion asks "What is the last page you finished?" only when the app is unsure (no entry for 3 or more days on a task under way), at most once a day for each task.
      New page-turn sound and vibration: each lit page plays the next note of a rising scale with a soft paper swish; Log gives a chime, a fuller chord when the daily goal is met, and a brighter sparkle for pages beyond the goal. The tap sound is now a soft, quiet glass "tink". The Companion now delivers the app's responses (confirmations, warnings, with the Undo button on a small card); with the Companion hidden, the normal toast returns. Cache v5-13.
