export interface Delivery {
  id: string;
  port: string;
  container: string;
  status: string;
  eta: string;
}

export interface Notification {
  text: string;
  time: string;
  color: string;
}

export interface Message {
  sender: 'assistant' | 'user';
  text: string;
}

export interface Message {
  sender: "assistant" | "user";
  text: string;
}
export interface Delivery {
  id: string;
  port: string;
  container: string;
  status: string;
  eta: string;
  [key: string]: string | number | boolean | undefined; // If extra fields are possible
}



