const Router = require('koa-tree-router');
const body = require('co-body');
const repo = require('../db/repo');

const router = new Router({
  onMethodNotAllowed: (ctx) => (ctx.body = '405: Method not allowed.'),
});

const sections = [
  'Ceramics',
  'Electronic Arts',
  'Jewellery',
  'Painting',
  'Photography',
  'Print',
  'Sculpture',
  'Textiles',
];

const mediums = [
  'Acrylic on board',
  'Acrylic on canvas',
  'Adapted found objects',
  'Bronze',
  'Ceramic',
  'DVD',
  'Digital c type print',
  'Digital file',
  'Digital inkjet print',
  'Digital still',
  'Earthenware',
  'Etching',
  'Fibre and board',
  'Fibre based gelatin silver print',
  'Found objects',
  'Intaglio',
  'Lithograph',
  'Mixed media',
  'Oil on board',
  'Oil on canvas',
  'Performance',
  'Screen print',
  'Sound media',
  'Sterling silver',
  'Stoneware',
  'Woodblock',
  'Woven dyed cotton',
];

const validateForm = ({
  firstName,
  lastName,
  title,
  section,
  siteMap,
  items,
}) => {
  const errors = [];

  if (firstName && lastName) {
    if (firstName.length > 100 || lastName.length > 100) {
      errors.push('First &/or last must not exceed 100 characters.');
    }
  } else {
    errors.push('First & last name is required.');
  }

  if (title && title.length > 50) {
    errors.push('Title must not exceed 50 characters.');
  }

  if (!title) {
    errors.push('Title is required.');
  }

  if (sections.indexOf(section) == -1) {
    errors.push('Section is invalid.');
  }

  const siteMapInt = parseInt(siteMap);
  if (!siteMapInt || siteMapInt > 100 || siteMapInt < 1) {
    errors.push('Site MAP Number must be from 1 to 100.');
  }

  if (!items.length || items.length < 1) {
    errors.push('You must add at least one catalogue item.');
  } else {
    items.forEach((item, i) => {
      const val = parseInt(item.value, 10);
      if (isNaN(val) || val < 0 || val > 100000) {
        errors.push(`Item ${i + 1} has an invalid price.`);
      }
      if (item.dimensions && item.dimensions.length > 14) {
        errors.push(`Item ${i + 1} has an invalid dimension.`);
      }
    });
  }
  return errors;
};

router.get('/', async (ctx) => (ctx.body = { mediums, sections }));

router.get('/entries', async (ctx) => (ctx.body = await repo.getEntries()));

router.get('/entries/:id', async (ctx) => {
  const entry = await repo.getEntry(ctx.params.id);
  ctx.assert(entry, 404, 'No entry found by that UID.');
  ctx.body = entry;
});

router.post('/entries', async (ctx) => {
  const formData = await body.json(ctx, { strict: true });
  console.log({ items: formData.items });
  const formErrors = validateForm(formData);
  if (formErrors.length > 0) {
    ctx.throw(400, formErrors[0]);
    return;
  }

  if (formData.items && formData.items.length > 0) {
    formData.items.forEach((item, i) => {
      item.id = `${
        formData.siteMap
      }-${formData.firstName[0].toUpperCase()}${formData.lastName[0].toUpperCase()}-${i}`;
    });
  }

  const uid = await repo.insertForm(formData);
  ctx.body = {
    uid,
  };

  await repo.insertIp(ctx.ip);
});

module.exports = router;
