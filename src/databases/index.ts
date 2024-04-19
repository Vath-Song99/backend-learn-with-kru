import mongoose from "mongoose";


export default class MongoDBConnector {
  private static instance: MongoDBConnector;
  private mongoUrl: string = "";
  private db = mongoose.connection;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): MongoDBConnector {
    if (!MongoDBConnector.instance) {
      MongoDBConnector.instance = new MongoDBConnector();
    }

    return MongoDBConnector.instance;
  }

  public static resetInstance(): void {
    MongoDBConnector.instance = new MongoDBConnector();
  }

  private setupEventListeners(): void {
    this.db.on("connected", () => {
      console.log("MongoDB connected");
    });

    this.db.on("error", (error) => {
      console.log("Error in MongoDB connection", { error });
    });

    this.db.on("disconnected", () => {
     console.log("MongoDB disconnected");
    });
  }

  public async connect({ url }: { url: string }): Promise<void> {
    this.mongoUrl = url;
    try {
      await mongoose.connect(this.mongoUrl);
      console.log("Successfully connected to MongoDB");
    } catch (err) {
      console.log("Initial MongoDB connection error", { err });
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.db.removeAllListeners();
    console.log("MongoDB disconnected and listeners removed");
  }
}
