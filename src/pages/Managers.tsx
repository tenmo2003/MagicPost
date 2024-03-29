import { UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tooltip, Input } from "antd";
import axios from "axios";
import moment from "moment";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SearchOutlined } from "@ant-design/icons";
import InviteUserModal from "../components/InviteUserModal";
import SkeletonTable from "../components/SkeletonTable";
import { ImNewTab } from "react-icons/im";
import {
  EE_ROLE,
  EM_ROLE,
  GE_ROLE,
  GM_ROLE,
  LEADER_ROLE,
} from "../helpers/constants";
import { roleNormalize, sortByString } from "../helpers/helpers";
import service from "../helpers/service";

function Managers(props: any) {
  const { role } = props;
  const navigate = useNavigate();
  const [roleAPI, setRoleAPI] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [gmCount, setGmCount] = useState(0);
  const [emCount, setEmCount] = useState(0);
  const [geCount, setGeCount] = useState(0);
  const [eeCount, setEeCount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  const [exchangePointsList, setExchangePointsList] = useState(null);
  const [noManagerExchangePointsList, setNoManagerExchangePointsList] =
    useState(null);
  const [gatherPointsList, setGatherPointsList] = useState(null);
  const [noManagerGatherPointsList, setNoManagerGatherPointsList] =
    useState(null);

  useEffect(() => {
    setLoading(true);
    if (role === LEADER_ROLE) {
      setRoleAPI("/leader");
    } else if (role === "EXCHANGE_MANAGER") {
      setRoleAPI("/ex-manager");
    } else if (role === "GATHER_MANAGER") {
      setRoleAPI("/gth-manager");
    }

    if (role && role === LEADER_ROLE && roleAPI === "/leader") {
      fetchDepartments();
    } else {
      setColumns(columnsWithoutAction);
    }

    if (roleAPI) {
      service
        .get(roleAPI + "/subordinates")
        .then((res) => {
          if (res.data.status !== 200) {
            toast.error(res.data.message);
            setLoading(false);
            return;
          }
          let gmCount = 0;
          let emCount = 0;
          let geCount = 0;
          let eeCount = 0;
          const filteredData = res.data.results.filter(
            (record: { role: string }) => {
              switch (record.role) {
                case EM_ROLE:
                  emCount++;
                  break;
                case GM_ROLE:
                  gmCount++;
                  break;
                case EE_ROLE:
                  eeCount++;
                  break;
                case GE_ROLE:
                  geCount++;
                  break;
                default:
                  break;
              }

              return (
                record.role !==
                (role === LEADER_ROLE
                  ? LEADER_ROLE
                  : role === EM_ROLE
                    ? EM_ROLE
                    : GM_ROLE)
              );
            },
          );

          setGmCount(gmCount);
          setEmCount(emCount);
          setGeCount(geCount);
          setEeCount(eeCount);
          setData(filteredData.reverse());
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err);
          setLoading(false);
        });
    }
  }, [role, roleAPI]);

  const [profileUser, setProfileUser] = useState<any>({});
  useEffect(() => {
    service
      .get("/users/me")
      .then((res) => {
        setProfileUser(res.data.results);
        console.log(profileUser);
      })
      .catch((err) => {
        toast.error(err.response);
      });
  }, []);

  const fetchDepartments = () => {
    axios
      .all([
        service.get("/leader/exchange-points"),
        service.get("/leader/gather-points"),
      ])
      .then(
        axios.spread((res1, res2) => {
          setExchangePointsList(res1.data.results);
          setGatherPointsList(res2.data.results);
          setNoManagerExchangePointsList(
            res1.data.results.filter(
              (exchangePoint: any) => exchangePoint.manager === null,
            ),
          );
          setNoManagerGatherPointsList(
            res2.data.results.filter(
              (gatherPoint: any) => gatherPoint.manager === null,
            ),
          );
          setLoading(false);
        }),
        () => {
          setLoading(false);
          toast.error("Something went wrong");
        },
      )
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  // Format to DD-MM-YYYY
  const formatDate = (date: string | number | Date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1; // Month starts from 0
    const year = formattedDate.getFullYear();

    // Use template string to format as DD-MM-YYYY
    return `${day < 10 ? "0" : ""}${day}-${
      month < 10 ? "0" : ""
    }${month}-${year}`;
  };

  const removeUser = (id: any) => {
    setLoading(true);
    service
      .delete("/leader/user?id=" + id)
      .then((res) => {
        setLoading(false);
        if (res.data.status !== 200) {
          toast.error(res.data.message);
          return;
        }
        toast.success(res.data.message);
        setData(data.filter((item: any) => item.id !== id));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false);
      });
  };

  const pagination = {
    hideOnSinglePage: false,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "15", "20", "25", "30"],
    defaultPageSize: 5,
    showTotal: (total: number, range: number[]) =>
      `${range[0]}-${range[1]} of ${total} items`,
  };

  const columnsWithAction = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: sortByString("fullName"),
      width: "20%",
      render: (fullName: any, record: any) => (
        <div
          className="cursor-pointer hover:text-blue-500"
          onClick={() => navigate(`/users/${record.id}`)}
        >
          {fullName}
        </div>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob: any) => formatDate(dob),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      ...(role === LEADER_ROLE && {
        filters: [
          {
            text: "Gather Employee",
            value: "GATHER_EMPLOYEE",
          },
          {
            text: "Gather Manager",
            value: "GATHER_MANAGER",
          },
          {
            text: "Exchange Manager",
            value: "EXCHANGE_MANAGER",
          },
          {
            text: "Exchange Employee",
            value: EE_ROLE,
          },
        ],
        onFilter: (value: any, record: any) => record.role.indexOf(value) === 0,
      }),
      render: (_text: string, record: any) => roleNormalize.get(record.role),
    },
    {
      title: "Joining Date",
      dataIndex: "startWorkingDate",
      key: "startWorkingDate",
      sorter: (a: any, b: any) => {
        return (
          moment(a.startWorkingDate).valueOf() -
          moment(b.startWorkingDate).valueOf()
        );
      },
      render: (startWorkingDate: any) => formatDate(startWorkingDate),
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      render: (_text: any, record: any) => (
        <div className="flex justify-center">
          <Tooltip title="Remove user">
            <Popconfirm
              title="Remove user"
              description="Are you sure you want to remove this user?"
              onConfirm={() => removeUser(record.id)}
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
      ),
    },
  ];

  const columnsWithoutAction = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: sortByString("fullName"),
      width: "20%",
      render: (fullName: any, record: any) => (
        <div
          className="cursor-pointer hover:font-bold hover:text-btnColor"
          onClick={() => navigate(`/users/${record.id}`)}
        >
          {fullName}
        </div>
      ),
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob: any) => formatDate(dob),
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "30%",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: "20%",
      ...(role === LEADER_ROLE && {
        filters: [
          {
            text: "Gather Employee",
            value: "GATHER_EMPLOYEE",
          },
          {
            text: "Gather Manager",
            value: "GATHER_MANAGER",
          },
          {
            text: "Exchange Manager",
            value: "EXCHANGE_MANAGER",
          },
          {
            text: "Exchange Employee",
            value: EE_ROLE,
          },
        ],
        onFilter: (value: any, record: any) => record.role.indexOf(value) === 0,
      }),
      render: (_text: string, record: any) => roleNormalize.get(record.role),
    },
    {
      title: "Joining Date",
      dataIndex: "startWorkingDate",
      key: "startWorkingDate",
      sorter: (
        a: { startWorkingDate: string | number | Date },
        b: {
          id(id: any): import("react").Key;
          startWorkingDate: string | number | Date;
        },
      ) => {
        return (
          moment(a.startWorkingDate).valueOf() -
          moment(b.startWorkingDate).valueOf()
        );
      },
      render: (startWorkingDate: any) => formatDate(startWorkingDate),
      width: "15%",
    },
  ];

  const [columns, setColumns] = useState(columnsWithAction);

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    const results = data.filter((item: any) =>
      item.fullName
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim()),
    );

    if (results.length !== searchResult.length) {
      setSearchResult(results);
    }
  }, [searchQuery, data]);

  return (
    <>
      <div className="pb-4">
        <div className="mb-4 ml-3 text-3xl font-bold">Subordinates</div>

        {role === "LEADER" && (
          <div className="mb-4 flex w-full flex-wrap justify-evenly">
            <div className="flex basis-[98%] items-center gap-3 border border-gray-300 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
              <img src="/assets/GM.svg" width={70} height={70} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{gmCount}</span>
                <span className="text-sm">Gather managers</span>
              </div>
            </div>
            <div className="flex basis-[98%] items-center gap-3 border border-gray-300 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
              <img src="/assets/EM2.svg" width={70} height={70} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{emCount}</span>
                <span className="text-sm">Exchange managers</span>
              </div>
            </div>
            <div className="flex basis-[98%] items-center gap-3 border border-gray-300 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
              <img src="/assets/GE.svg" width={70} height={70} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{geCount}</span>
                <span className="text-sm">Gather employees</span>
              </div>
            </div>
            <div className="flex basis-[98%] items-center gap-3 border border-gray-300 bg-white px-5 py-3 shadow-lg sm:basis-[45%] xl:basis-[23%]">
              <img src="/assets/EE.svg" width={70} height={70} />
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{eeCount}</span>
                <span className="text-sm">Exchange employees</span>
              </div>
            </div>
          </div>
        )}

        {role === "GATHER_MANAGER" && (
          <div className="mx-auto mb-4 flex w-[98%] items-center justify-between rounded-md bg-white px-5 shadow-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xl">
                <div>
                  <span className="font-bold">Gather Point: </span>
                  {profileUser.departmentId}
                </div>
                <Tooltip title="View detail">
                  <ImNewTab
                    className="cursor-pointer hover:text-btnColor"
                    onClick={() =>
                      navigate(`/gather-points/${profileUser.departmentId}`, {
                        state: { manager: "/gth-manager" },
                      })
                    }
                  />
                </Tooltip>
              </div>
              <div className="mt-3 text-xl">
                <span className="font-bold">Number Of Employees: </span>
                {geCount}
              </div>
            </div>

            <img
              src="/assets/GE.svg"
              width={100}
              height={100}
              className="m-3"
            />
          </div>
        )}

        {role === "EXCHANGE_MANAGER" && (
          <div className="mx-auto mb-4 flex w-[98%] items-center justify-between rounded-md bg-white px-5 shadow-lg">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 text-xl">
                <div>
                  <span className="font-bold">Exchange Point: </span>
                  {profileUser.departmentId}
                </div>
                <Tooltip title="View detail">
                  <ImNewTab
                    className="cursor-pointer hover:text-btnColor"
                    onClick={() =>
                      navigate(`/exchange-points/${profileUser.departmentId}`, {
                        state: { manager: "/ex-manager" },
                      })
                    }
                  />
                </Tooltip>
              </div>
              <div className="mt-3 text-xl">
                <span className="font-bold">Number Of Employees: </span>
                {eeCount}
              </div>
            </div>

            <img
              src="/assets/EE.svg"
              width={100}
              height={100}
              className="m-3"
            />
          </div>
        )}

        <div className="mb-2 flex w-full justify-end">
          <Button
            className="mr-3"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setModalOpen(true)}
          >
            Invite
          </Button>
        </div>

        <div className="rounded-xl bg-white p-3 shadow-lg">
          <div className="mb-4 flex w-full items-center justify-center rounded-lg bg-white">
            <Input
              placeholder="Employee Name"
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
          <SkeletonTable className="w-full" loading={loading} columns={columns}>
            <Table
              className="w-full"
              columns={columns}
              dataSource={searchResult}
              rowKey={(record) => String(record.id)}
              pagination={pagination}
              scroll={{ x: 800 }}
            />
          </SkeletonTable>
        </div>
      </div>
      <InviteUserModal
        open={modalOpen}
        setOpen={setModalOpen}
        gatherPointsList={gatherPointsList}
        exchangePointsList={exchangePointsList}
        noManagerGatherPointsList={noManagerGatherPointsList}
        noManagerExchangePointsList={noManagerExchangePointsList}
        currentRole={role}
      />
    </>
  );
}

Managers.propTypes = {
  role: PropTypes.string,
};

export default Managers;
