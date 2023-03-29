const { connect, headers } = require("nats");

const natsUrl = "localhost:4222";
const subject = "trace_events";

const exampleEvents = [
  {
    trace: {
      parent_span_id: "",
      span_id: "",
      trace_id: "715a1e6d8183200527811d8f7e091c3d",
      service_name: "todo_service",
      operation: "controller",
      start_time: new Date().toISOString(),
      end_time: new Date(new Date().getTime() + 2000).toISOString(),
      attributes: {
        isMyPlace: "false",
        amount: "1567",
      },
    },
    metric: {
      category: "domainEvent",
      name: "todo_deleted",
    }
  },
  // {
  //   parent_span_id: "",
  //   span_id: "",
  //   trace_id: "115a1e6d8183200527811d8f7e091c3d",
  //   service_name: "driver",
  //   operation: "query12",
  //   start_time: new Date().toISOString(),
  //   end_time: new Date(new Date().getTime() + 2000).toISOString(),
  //   attributes: {
  //     isMyPlace: "false",
  //     amount: "1567",
  //   },
  // },
];

//add spamId, traceId to headers
(async () => {
  const nc = await connect({ servers: natsUrl });
  const js = nc.jetstream();

  for (const event of exampleEvents) {
    const eventData = JSON.stringify(event);
    const pubAck = await js.publish(subject, Buffer.from(eventData)
   );
    console.log(`Published event ${event.trace_id} with sequence ${pubAck.seq}`);
  }

  await nc.drain();
  nc.close();
})();