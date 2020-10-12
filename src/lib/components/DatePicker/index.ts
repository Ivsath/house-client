import "antd/lib/date-picker/style/index";

import generatePicker from "antd/lib/date-picker/generatePicker";
import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";

export const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
