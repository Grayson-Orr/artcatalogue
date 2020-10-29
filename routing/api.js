const Router = require("koa-tree-router");
const cobody = require("co-body");
const repo = require("../db/repo");

const router = new Router({
  onMethodNotAllowed: (ctx) => ctx.body = "405: Method not allowed.",
});

const sections = ["PHEA", "Jewellery/Textile", "Painting", "Sculpture/Ceramics", "Printmaking"];
const mediums = [
  "Performance",
  "Digital file",
  "Digital inkjet print",
  "Acrylic on board",
  "Acrylic on canvas",
  "Adapted found objects",
  "Bronze",
  "Ceramic",
  "Digital c type print",
  "Digital still",
  "DVD",
  "Earthenware",
  "Etching",
  "Fibre and board",
  "Found objects",
  "Fibre based gelatin silver print",
  "Intaglio",
  "Lithograph",
  "Mixed media",
  "Oil on board",
  "Oil on canvas",
  "Sound media",
  "Screen print",
  "Sterling silver",
  "Stoneware",
  "Woodblock",
  "Woven dyed cotton",

];

/**
 * Takes user inputted form data and validates all fields.
 * @returns An array of human readable errors.
*/
function validateForm({ firstName, lastName, title, section, siteMap, items }) {
  const errors = [];

  if(firstName && lastName) {
    if(firstName.length > 100 || lastName.length > 100) {
      errors.push("Fields must not exceed 100 characters");
    }
  } else {
    errors.push("First and last names required");
  }

  if(title && title.length > 50) {
    errors.push("Title must not exceed 50 characters");
  }
  if(!title) {
    errors.push("Entry must have a title");
  }

  if(sections.indexOf(section) == -1) {
    errors.push("Invalid section");
  }

  const siteMapInt = parseInt(siteMap);
  if(!siteMapInt || siteMapInt > 100 || siteMapInt < 1) {
    errors.push("Site MAP number must be from 1 to 100");
  }

  if(!items.length || items.length < 1) {
    errors.push("You must add at least one catalogue item.");
  } else {
    items.forEach((item, i) => {
      const val = parseInt(item.value, 10);
      if(isNaN(val) || val < 0 || val > 100000) {
        // i is zero indexed
        errors.push(`Item ${i + 1} has an invalid price`);
      }
      if(mediums.indexOf(item.medium) == -1) {
        errors.push(`Item ${i + 1} has an invalid medium`);
      }
      if(item.dimensions && item.dimensions.length > 14) {
        errors.push(`Item ${i + 1} has invalid dimensions`);
      }
    });
  }

  return errors;
}

// Entries GET handler
router.get(
  "/entries",
  async function(ctx) {
    ctx.body = await repo.getEntries();
  }
)

// Form GET handler
router.get(
  "/entries/:id",
  async function(ctx) {
    const entry = await repo.getEntry(ctx.params.id);
    ctx.assert(entry, 404, "No entry found by that UID");
    ctx.body = entry;
  }
)

// Form POST handler
router.post(
  "/entries",
  async function(ctx) {
    
    const formData = await cobody.json(ctx, { strict: true, });
    console.log({ items: formData.items });
    const formErrors = validateForm(formData);
    if(formErrors.length > 0) {
      ctx.throw(400, formErrors[0]);
      return;
    }

    // Generate item ids
    if(formData.items && formData.items.length > 0) {
      formData.items.forEach((item, i) => {
        item.id = `${formData.siteMap}-${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}-${i}`;
      });
    }
    
    const uid = await repo.insertForm(formData);
    ctx.body = {
      uid,
    };

    await repo.insertIp(ctx.ip);
  }
);

// General info
router.get(
  "/",
  async function(ctx) {
    ctx.body = { mediums, sections, }
  }
);

module.exports = router;
