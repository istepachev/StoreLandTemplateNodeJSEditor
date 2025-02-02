import Joi from "joi";
import chalk from "chalk";

const envSchema = Joi.object({
  CURRENT_SITE: Joi.string().uri().required().messages({
    "string.uri": "должен быть валидным URL адресом",
    "any.required": "отсутствует в .env файле",
    "string.empty": "не может быть пустым",
  }),

  SECRET_KEY: Joi.string().min(6).required().messages({
    "string.min": "должен содержать минимум {#limit} символов",
    "any.required": "отсутствует в .env файле",
    "string.empty": "не может быть пустым",
  }),
}).unknown(); // разрешаем дополнительные переменные в .env

export function validateEnv() {
  const { error } = envSchema.validate(process.env, { abortEarly: false });

  if (error) {
    console.error(chalk.red("\n⛔ Ошибки валидации .env файла:"));

    error.details.forEach(({ path, message }) => {
      console.error(`  • ${chalk.red(path[0])} ${message}`);
    });

    console.log(
      chalk.gray(
        "\nПроверьте файл .env и убедитесь, что все переменные заданы корректно.\n",
      ),
    );
    process.exit(1);
  }

  return true;
}
