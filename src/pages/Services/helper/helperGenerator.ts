export default class HelperGenerator {
  private data: any[];

  constructor(data: any[]) {
    this.data = data
  }

  getData(): any[] {
    let array: any[] = [];
    for (let item of this.data) {
      if (item) {
        let obj = {
          id: item.id,
          label: item.display,
          code: item.code,
          children: [{}],
        }
        array.push(obj)
      }

    }
    return array
  }
}
