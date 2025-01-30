import { Message } from "@/types/discussion";
import { MockHttpProvider } from "@/lib/storage";
import { MessageDataProvider } from "@/types/storage";

export class MessageService {
  constructor(private readonly provider: MessageDataProvider) {}

  async listMessages(discussionId: string): Promise<Message[]> {
    const messages = await this.provider.list();
    return messages
      .filter(msg => msg.discussionId === discussionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getMessage(id: string): Promise<Message> {
    return this.provider.get(id);
  }

  async addMessage(discussionId: string, message: Omit<Message, "id" | "discussionId">): Promise<Message> {
    const newMessage: Omit<Message, "id"> = {
      ...message,
      discussionId,
      timestamp: new Date(),
    };

    return this.provider.create(newMessage);
  }
}

// 创建服务实例
export const messageService = new MessageService(
  new MockHttpProvider<Message>("messages", 200)
); 