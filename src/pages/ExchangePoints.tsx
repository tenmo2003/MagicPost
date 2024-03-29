import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Tooltip, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
import InsertNewPointModal from "../components/InsertNewPointModal";
import SkeletonTable from "../components/SkeletonTable";
import { sortByString } from "../helpers/helpers";
import service from "../helpers/service";
import { AiOutlineDelete } from "react-icons/ai";

export default function ExchangePoints() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);

  const [modalPointOpen, setModalPointOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const removePoint = (id: string) => {
    setLoading(true);
    service
      .delete(`/leader/exchange-point/${id}`)
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          toast.success(res.data.message);
          setData((data: any) => data.filter((item: any) => item.id !== id));
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "id",
      key: "id",
      sorter: sortByString("id"),
      render: (_text: string, record: any) => {
        return (
          <div
            onClick={() => {
              navigate(`/exchange-points/${record.id}`, {
                state: { exchangePoint: record },
              });
            }}
            className="cursor-pointer hover:text-btnColor"
          >
            {record.id}
          </div>
        );
      },
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      sorter: sortByString("manager"),
      render: (_text: string, record: any) => record.manager?.fullName,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: sortByString("location"),
      filters: [
        {
          text: "Hải Phòng",
          value: "Hải Phòng",
        },
        {
          text: "Vinh",
          value: "Vinh",
        },
        {
          text: "Hà Nội",
          value: "Hà Nội",
        },
        {
          text: "Biên Hòa",
          value: "Biên Hòa",
        },
        {
          text: "Hồ Chí Minh",
          value: "Hồ Chí Minh",
        },
      ],
      onFilter: (value: any, record: any) =>
        record.location.indexOf(value) === 0,
    },
    {
      title: "Linked Gather Point",
      dataIndex: "linkedGatherPoints",
      key: "linkedGatherPoints",
      render: (_text: string, record: any) => {
        return record.linkedGatherPoint ? (
          <Tag
            onClick={() => {
              navigate(`/gather-points/${record.linkedGatherPoint.id}`, {
                state: { gatherPoint: record.linkedGatherPoint },
              });
            }}
            className="hover:cursor-pointer hover:font-bold hover:text-btnColor"
          >
            {record.linkedGatherPoint.id}
          </Tag>
        ) : (
          ""
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_text: string, record: any) => {
        return (
          <div className="flex justify-center">
            <Tooltip title="Remove point">
              <Popconfirm
                title="Remove exchange point"
                description="Are you sure you want to remove this exchange point?"
                onConfirm={() => removePoint(record.id)}
                placement="left"
                okText="Yes"
                cancelText="No"
              >
                <AiOutlineDelete
                  color="red"
                  size={20}
                  className="cursor-pointer"
                />
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const pagination = {
    hideOnSinglePage: false,
    defaultPageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "30"],
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const onAddPointSuccess = (point: any) => {
    setData([point, ...data]);
  };

  useEffect(() => {
    setLoading(true);
    service
      .get("/leader/exchange-points")
      .then((res) => {
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          setLoading(false);
          return;
        }
        setData(res.data.results.reverse());
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err);
        setLoading(false);
      });
  }, []);

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = data.filter((item: any) =>
      item.id
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, data]);

  return (
    <div className="pb-4">
      <div className="mb-4 flex max-md:flex-col max-md:gap-4">
        <div className="ml-3 text-3xl font-bold">Exchange points</div>
        <Button
          type="primary"
          onClick={() => setModalPointOpen(true)}
          className="ml-auto mr-3 shadow-[0_2px_0_rgba(0,0,0,0.2),0_8px_16px_0_rgba(0,0,0,0.15)]"
          icon={<PlusCircleOutlined />}
        >
          Add new exchange point
        </Button>
      </div>
      <div className="rounded-xl bg-white p-3 shadow-lg">
        <div className="mb-4 flex w-full items-center justify-center rounded-lg bg-white">
          <Input
            placeholder="Name ExchangePoint"
            className="w-[97%] px-2 py-1 md:w-[30%]"
            suffix={
              <div className="rounded-l px-2 py-1">
                <SearchOutlined className="transition-all duration-300" />
              </div>
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <SkeletonTable loading={loading} columns={columns}>
          <Table
            scroll={{ x: 800 }}
            columns={columns}
            dataSource={searchResult}
            rowKey={(record) => String(record.id)}
            pagination={pagination}
          />
        </SkeletonTable>
      </div>
      <InsertNewPointModal
        apiEndpoint="/leader/exchange-point"
        isOpen={modalPointOpen}
        setModalOpen={setModalPointOpen}
        onAddPointSuccess={onAddPointSuccess}
      />
    </div>
  );
}
