export class Model {
  _backupData = {};
  _statusData = {
    isChanged: false,
    isSelected: false
  };

  /**
   *
   * @param fields
   */
  setupBackup(fields: string[]|null): void {
    if (fields !== null) {
      let length = fields.length;
      for (let i = 0; i < length; i++) {
        if (this[fields[i]] !== null) {
          this._backupData[fields[i]] = this[fields[i]];
        }
      }
    } else {
      for (let i in this._backupData) {
        if (this[i] !== null) {
          this._backupData[i] = this[i];
        }
      }
    }
  };


  /**
   *
   */
  restoreBackup(fields?: string[]): void {
    if (fields) {
      let length = fields.length;
      for (let i = 0; i < length; i++) {
        if (this._backupData[fields[i]] !== undefined)
          this[fields[i]] = this._backupData[fields[i]];
        else
          console.error("Поле " + fields[i] + " не найдено");
      }
    } else {
      for (let i in this._backupData) {
        this[i] = this._backupData[i];
      }
    }
  };


  /**
   *
   * @param flag
   * @returns {boolean}
   */
  changed(flag?: boolean): boolean {
    if (flag !== undefined)
      this._statusData.isChanged = flag;
    return this._statusData.isChanged;
  };


  selected(flag?: boolean): boolean {
    if (flag !== null)
      this._statusData.isSelected = flag;
    return this._statusData.isSelected;
  };

};
