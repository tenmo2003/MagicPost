import { Button, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import service from "../helpers/service";

function NewPackage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    setDestinationLoading(true);
    service
      .get("/ex-employee/destinations")
      .then(
        (res) => {
          setDestinations(res.data.results);
          setDestinationLoading(false);
        },
        () => {
          setDestinationLoading(false);
          toast.error("Failed to get destinations");
        },
      )
      .catch((err) => {
        toast.error("Failed to get destinations ", err.response.data.message);
      });
    form.setFieldValue("packageType", "GOODS");
  }, []);

  const onFinish = () => {
    setLoading(true);
    service
      .post("/ex-employee/new-package", form.getFieldsValue())
      .then((res) => {
        setLoading(false);
        if (res.data.status === 201) {
          toast.success(res.data.message);
          form.resetFields();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Failed to create package ", err.response.data.message);
      });
  };
  return (
    <>
      <h1 className="mb-4 ml-3 self-start text-3xl font-bold">New Package</h1>

      <div className="mx-auto w-[70%] rounded-xl bg-white p-4 shadow-lg max-lg:w-[90%]">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="flex flex-col items-center"
        >
          <span className="text-center text-2xl font-bold">
            {" "}
            Create New Package{" "}
          </span>
          <hr className="mt-3 w-[60%]" style={{ borderWidth: 1 }} />
          <div className="flex w-[90%] flex-wrap gap-x-10 p-5 max-md:px-0 ">
            <Form.Item
              name="senderName"
              label="Sender Name"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="senderContact"
              label="Sender Contact"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
                {
                  pattern: /^\d{10}$/,
                  message: "Please enter a valid phone number!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="receiverName"
              label="Receiver Name"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="receiverContact"
              label="Receiver Contact"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
                {
                  pattern: /^\d{10}$/,
                  message: "Please enter a valid phone number!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="orgAddress"
              label="Origin Address"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="desAddress"
              label="Destination Address"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
              ]}
            >
              <Input className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="packageType"
              label="Package Type"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please select package type!",
                },
              ]}
            >
              <Select
                options={[
                  {
                    value: "GOODS",
                    label: "Goods",
                  },
                  {
                    value: "DOCUMENT",
                    label: "Document",
                  },
                ]}
                className="drop-shadow"
              />
            </Form.Item>
            <Form.Item
              name="weight"
              label="Weight (kg)"
              className="w-full sm:w-[100%] lg:w-[45%]"
              rules={[
                {
                  required: true,
                  message: "Please fill out this field!",
                },
              ]}
            >
              <Input type="number" className="drop-shadow" />
            </Form.Item>
            <Form.Item
              name="desPointId"
              label="Destination"
              className="w-full sm:w-[100%] lg:w-[95%]"
              rules={[
                { required: true, message: "Please select destination!" },
              ]}
            >
              <Select
                showSearch
                filterOption={(input: string, option: any) =>
                  option.label.toLowerCase().includes(input.toLowerCase()) ||
                  option.value.toLowerCase().includes(input.toLowerCase())
                }
                options={
                  destinations &&
                  destinations.map((d) => ({
                    value: d.id,
                    label: d.id + " - " + d.location,
                  }))
                }
                optionRender={(option: any) => {
                  return (
                    <>
                      <span>{option.label}</span>
                    </>
                  );
                }}
                loading={destinationLoading}
                disabled={destinationLoading}
                className="drop-shadow"
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit" loading={loading}>
            Create
          </Button>
        </Form>
      </div>
    </>
  );
}

export default NewPackage;
