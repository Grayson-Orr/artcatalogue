import cors from "cors";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const app = express();

const PORT = process.env.PORT || 5000;
const API_VERSION = "/api/v1";

app.use(cors());
app.use(express.json());

const validateCatalogueItem = (item) => {
  const errors = {};

  if (!item.title) {
    errors.title = "Title is required.";
  }

  if (!item.medium) {
    errors.medium = "Medium is required.";
  }

  if (!item.dimensions) {
    errors.dimensions = "Dimensions is required.";
  }

  if (item.hasEdition) {
    if (!item.editions) {
      errors.editions = "Editions is required.";
    }
    if (item.editions < 1) {
      errors.editions = "Editions must be a number greater than 0.";
    }
  }

  if (item.nfs) {
    if (!item.value) {
      errors.value = "Value is required.";
    }
    if (item.value < 1) {
      errors.value = "Value must be a number greater than 0.";
    }
  }

  return errors;
};

app.get(`${API_VERSION}/catalogue-items`, async (req, res) => {
  try {
    const catalogueItems = await prisma.catalogueItem.findMany();

    if (catalogueItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No catalogue items found.",
      });
    }

    const groupedItemsArray = Object.entries(
      catalogueItems.reduce((acc, item) => {
        const { uuid, ...itemData } = item;
        if (!acc[uuid]) {
          acc[uuid] = {
            uuid,
            items: [],
            count: 0,
          };
        }
        acc[uuid].items.push(itemData);
        acc[uuid].count += 1;
        return acc;
      }, {})
    ).map(([_, value]) => value);

    return res.status(200).json({
      success: true,
      data: groupedItemsArray,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get(`${API_VERSION}/catalogue-items/:uuid`, async (req, res) => {
  const { uuid } = req.params;

  try {
    const catalogueItem = await prisma.catalogueItem.findMany({
      where: { uuid },
    });

    if (!catalogueItem) {
      return res.status(404).json({
        success: false,
        error: "Catalogue item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: catalogueItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.post(`${API_VERSION}/catalogue-items`, async (req, res) => {
  const { firstName, lastName, siteMap, section, items } = req.body;

  const uuid = uuidv4();

  const catalogueItems = [];
  const errors = {};

  if (!firstName) errors.firstName = "First name is required.";
  if (!lastName) errors.lastName = "Last name is required.";
  if (!siteMap) errors.siteMap = "Site map is required.";
  if (siteMap < 1) {
    errors.siteMap = "Site map must be a number greater than 0.";
  }

  for (const item of items) {
    const itemErrors = validateCatalogueItem(item);
    if (Object.keys(itemErrors).length > 0) {
      errors["item"] = itemErrors;
    } else {
      catalogueItems.push({
        ...item,
        uuid,
        firstName,
        lastName,
        siteMap,
        section,
      });
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  try {
    const createdItems = await prisma.catalogueItem.createMany({
      data: catalogueItems,
    });

    return res.status(201).json({
      success: true,
      data: createdItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
