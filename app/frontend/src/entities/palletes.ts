/**
 * Объект палитры цветов, полученный с сервера
 */
export type Pallete = {
  /**
   * Уникальный идентификатор палитры (UUID)
   */
  id: string;
  /**
   * Название палитры
   */
  name: string;
  /**
   * Ключ палитры для идентификации
   */
  key: string;
  /**
   * Основной цвет палитры в формате hex (#RRGGBB)
   */
  primaryColor: string;
  /**
   * Дополнительный цвет палитры в формате hex (#RRGGBB)
   */
  foreignColor: string;
  /**
   * Дата создания палитры в формате ISO 8601
   */
  createdAt: string;
  /**
   * Дата последнего обновления палитры в формате ISO 8601
   */
  updatedAt: string;

  /**
   * Цветовая схема палитры
   */
  colorScheme: string;
};