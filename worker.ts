// Worker - Processes score messages from Redis Stream
import 'dotenv/config';
import { scoreConsumer } from './layers/messaging';
import { scoreService } from './layers/business';

async function main() {
  // Initialize consumer group
  await scoreConsumer.initialize();
  
  console.log('Worker started listening...');

  while (true) {
    try {
      // Read messages from the stream
      const messages = await scoreConsumer.readMessages(1, 5000);

      for (const message of messages) {
        const { username, points, ack } = message;
        
        console.log(`Processing message: ${username} +${points}`);

        // Process score through business layer
        await scoreService.processScore({
          username,
          points,
        });

        // Acknowledge message after successful processing
        await ack();
        
        console.log(`Successfully processed score for ${username}`);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Continue processing next messages even if one fails
    }
  }
}

main().catch((error) => {
  console.error('Worker crashed:', error);
  process.exit(1);
});