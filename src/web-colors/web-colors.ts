import { Colors } from "chat-models";

export class WebColors {
  private colors: string[];
  constructor() {
    this.colors = Colors.defaults;
  }

  public Get(): string {
    return this.colors.pop();
  }
}
