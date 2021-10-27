# (POC) Search and suggest restaurant and group buy in Facebook Messenger Chatbot.

![Mother-Forker](./mf_360.gif)

This is a proof of concept to utilize Messenger as a nearby store's search engine, to find the store or restaurant that user are interested in.

---

FLOW
- User join the chatbot.
- Using share location function, or type in address.
- Chatbot will return atmost 10 stores around the given location order by distance.

---

COMPLETE APP FLOW
- ⭕ User join the chatbot.
- ❌ Show user a series question about what they want kind of store or restaurant to find.
- ⭕ Using share location function, or type in address.
- ⭕ Chatbot will return atmost 10 stores around the given location order by distance.
- ❌ Click on the button rendered under the store list.
- ❌ Open Webview
- ❌ Login/Register with Facebook OAuth
- ❌ Assign a shopping session to the cart owner.
- ❌ Owner can share the link with their Facebook friends to join the shopping session.

Then the rest will be like all the shopping cart routine.

Probably going to build this little app more seriously with different language 🙄

---

STACK
- 🐈 Nest.js as backend
- 🐘 Postgresql with Postgis extension
- 🤖 Facebook Messenger Platform API
