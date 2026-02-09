import type { Category } from "@/lib/types";

import { angle } from "./angle";
import { area } from "./area";
import { concentration } from "./concentration";
import { cooking } from "./cooking";
import { dataRate } from "./data-rate";
import { density } from "./density";
import { digitalStorage } from "./digital-storage";
import { energy } from "./energy";
import { flowRate } from "./flow-rate";
import { force } from "./force";
import { frequency } from "./frequency";
import { fuelEconomy } from "./fuel-economy";
import { illuminance } from "./illuminance";
import { length } from "./length";
import { mass } from "./mass";
import { power } from "./power";
import { pressure } from "./pressure";
import { speed } from "./speed";
import { temperature } from "./temperature";
import { time } from "./time";
import { torque } from "./torque";
import { volume } from "./volume";

export const categories: Category[] = [
  length,
  area,
  volume,
  mass,
  temperature,
  speed,
  pressure,
  energy,
  power,
  force,
  torque,
  fuelEconomy,
  time,
  digitalStorage,
  dataRate,
  angle,
  frequency,
  flowRate,
  density,
  concentration,
  illuminance,
  cooking,
];
