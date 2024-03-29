import { Button, Modal, QRCode } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function InvoicePrintModal(props: any) {
  const componentRef = useRef(null);

  const { open, setOpen, data } = props;

  const onClose = () => {
    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Modal
      open={open}
      width={"80%"}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="print" type="primary" onClick={handlePrint}>
          Print
        </Button>,
      ]}
    >
      {data && (
        <div
          ref={componentRef}
          className="item-center flex flex-col justify-center"
        >
          <div className="flex items-center justify-around">
            <img src="/assets/logo_edit.png" width={160} height={130} className="ml-4"/>
            <div className="flex flex-col items-center">
              <QRCode size={130} value={"http://magicpost.com/package-detail/" + data.id} />
              <p className="text-md">{data.id}</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {/* Khung to */}
            <div className="flex h-[550px] w-[1000px] border">
              {/* Nửa thứ nhất */}
              <div className="flex-1 border border-black">
                {/* Chia thành 5 khung nhỏ */}
                <div className="h-[20%] flex-1 border border-black pl-1">
                  <span className="title">1. Họ tên địa chỉ người gửi: </span> <br />
                  <p className="information mb-0.9">{data.senderName}</p>
                  <p className="information">{data.orgAddress}</p>
                  <div className="mt-2 flex gap-1">
                    <p className="title">Điện thoại: </p>
                    <p className="information">{data.senderContact}</p>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <p className="title">Mã bưu chính: </p>
                    <p className="information">{data.orgPointId}</p>
                  </div>
                </div>
                <div className="h-1/10 flex-1 border border-black pl-1">
                  <span className="title">3. Loại hàng gửi:</span> <br />
                  <span className="mt-2 flex items-center gap-40">
                    <span className="ml-12 flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">Tài liệu</div>
                    </span>

                    <span className="flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">Hàng hóa</div>
                    </span>
                  </span>
                  <span className="title">4. Nội dung trị giá bưu gửi:</span>{" "}
                  <br />
                </div>
                <div className="h-1/10 flex-1 border border-black">
                  <div className="flex">
                    {/* Cột 1 */}
                    <div className="flex w-[25%] flex-col border">
                      <div className="title flex h-1/2 justify-center border-b border-r border-black bg-gray-400 p-1">
                        Nội dung
                      </div>
                      <div className="information flex h-1/2 justify-center border-r border-t border-black p-1">
                        Tổng
                      </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="flex w-[15%] flex-col border">
                      <div className="title flex h-1/2 justify-center border-b border-r border-black bg-gray-400 p-1">
                        Số lượng
                      </div>
                      <div className="information flex h-1/2 justify-center border-r border-t border-black p-1">
                        0
                      </div>
                    </div>

                    {/* Cột 3 */}
                    <div className="flex w-[20%] flex-col border">
                      <div className="title flex h-1/2 justify-center border-b border-r border-black bg-gray-400 p-1">
                        Trị giá
                      </div>
                      <div className="information flex h-1/2 justify-center border-r border-t border-black p-1"></div>
                    </div>

                    {/* Cột 4 */}
                    <div className="flex w-[40%] flex-col border">
                      <div className="title flex h-1/2 justify-center border-b border-black bg-gray-400 p-1">
                        Giấy tờ đính kèm
                      </div>
                      <div className="information flex h-1/2 justify-center  border-t border-black p-1"></div>
                    </div>
                  </div>
                </div>
                <div className="h-[17%] flex-1 border border-black pl-1 pt-2">
                  <span className="title">5. Dịch vụ đặc biệt/Cộng thêm:</span>{" "}
                  <br />
                  <div className="mt-3 flex items-center">
                    <div className="dotted-line flex-1 border-t border-black"></div>
                  </div>
                  <div className="mt-5 flex items-center">
                    <div className="dotted-line flex-1 border-t border-black"></div>
                  </div>
                  <span className="information">Mã hợp đồng MAGIC/POST</span>
                </div>
                <div className="h-[15%] flex-1 border border-black pl-1">
                  <span className="title">
                    6. Chỉ dẫn của người gửi khi không phát được bưu gửi:
                  </span>
                  <br />
                  <span className="mt-1 flex items-center gap-8">
                    <span className="ml-4 flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">Chuyển hoàn ngay</div>
                    </span>

                    <span className="flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">
                        Gọi điện cho người gửi/BC gửi
                      </div>
                    </span>

                    <span className="flex items-center ml-3">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">Hủy</div>
                    </span>
                  </span>
                  <span className="mt-4 flex items-center gap-12">
                    <span className="ml-4 flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">
                        Chuyển hoàn trước ngày
                      </div>
                    </span>

                    <span className="flex items-center">
                      <div className="h-4 w-4 border-2 border-black"></div>
                      <div className="information ml-2">
                        Chuyển hoàn khi hết thời gian lưu trữ
                      </div>
                    </span>
                  </span>
                </div>
                <div className="h-[25%] flex-1 border border-black pl-1">
                  <span className="title">7. Cam kết của người gửi:</span>{" "}
                  <br />
                  <p className="information">
                    Tôi chấp nhận các điều khoản tại mặt sau phiếu gửi và cam
                    đoan bưu gửi này không chứa những mặt hàng nguy hiểm, cấm
                    gửi. Trường hợp không phát được hãy thực hiện chỉ dẫn tại
                    mục 6, tôi sẽ trả cước chuyển hoàn.
                  </p>
                  <div className="flex mt-1 gap-44">
                    <div className="title">8. Ngày giờ gửi:</div>
                    <div className="title">Chữ ký người gửi</div>
                  </div>
                  <div className="information mt-5">
                    {moment(data.sendAt).format("HH:mm [ngày] DD-MM-YYYY")}
                  </div>
                </div>
              </div>

              {/* Nửa thứ hai */}
              <div className="flex flex-1 flex-col border border-black">
                {/* Khung thứ nhất */}
                <div className="h-1/5 flex-1 border border-black pl-1">
                  <span className="title">2. Họ tên địa chỉ người nhận: </span>{" "}
                  <br />
                  <p className="information mb-0.9">{data.receiverName}</p>
                  <p className="information">{data.desAddress}</p>
                  <div className="mt-2 flex gap-1">
                    <p className="title">Điện thoại: </p>
                    <p className="information">{data.receiverContact}</p>
                  </div>
                  <div className="mt-1 flex gap-1">
                    <p className="title">Mã bưu chính: </p>
                    <p className="information">{data.desPointId}</p>
                  </div>
                </div>
                {/* Khung thứ hai */}
                <div className="flex h-[50%]">
                  {/* Chia thành 2 nửa */}
                  <div className="flex w-[65%] border border-black">
                    <div className="flex flex-1 flex-col border-black">
                      {/* Chia thành 2 phần */}
                      <div
                        className="flex-1 border-b border-black pl-1"
                        style={{ flexBasis: "60%" }}
                      >
                        <p className="title mb-2 mt-1">9. Cước: </p>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">a. Cước chính:</div>
                          </div>
                          <div className="information mr-1 text-right">
                            {data.rate}{" VND"}
                          </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">b. Phụ phí:</div>
                          </div>
                          <div className="information mr-1 text-right">
                            {data.sideFee}{" VND"}
                          </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">c. Cước GTGT:</div>
                          </div>
                          <div className="information mr-1 text-right">0 VND</div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">
                              d. Tổng cước (gồm VAT):
                            </div>
                          </div>
                          <div className="information mr-1 text-right">
                            {data.sideFee + data.rate}{" VND"}
                          </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">e. Thu khác:</div>
                          </div>
                          <div className="information mr-1 text-right">0 </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="title">f. Tổng thu:</div>
                          </div>
                          <div className="information mr-1 text-right">
                            {data.sideFee + data.rate}{" VND"}
                          </div>
                        </span>
                      </div>
                      <div
                        className="flex-1 border-t border-black pl-1"
                        style={{ flexBasis: "40%" }}
                      >
                        <p className="title mb-2 mt-1">
                          11. Thu của người nhận:{" "}
                        </p>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">COD:</div>
                          </div>
                          <div className="information mr-1 text-right">0 </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">Thu khác:</div>
                          </div>
                          <div className="information mr-1 text-right">0 </div>
                        </span>
                        <span className="mb-1 flex items-center">
                          <div className="flex-1">
                            <div className="information">Tổng thu:</div>
                          </div>
                          <div className="information mr-1 text-right">0 </div>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Nửa thứ 2 khung 2 */}
                  <div className="flex flex-1 flex-col border border-black">
                    {/* Chia thành 2 phần */}
                    <div
                      className="flex-1 border-b border-black pl-1"
                      style={{ flexBasis: "25%" }}
                    >
                      <p className="title mb-2 mt-1">10. Khối lượng (kg): </p>
                      <span className="mb-1 flex items-center">
                        <div className="flex-1">
                          <div className="information">Khối lượng thực tế:</div>
                        </div>
                        <div className="information mr-1 text-right">
                          {data.weight}{" "}
                        </div>
                      </span>
                      <span className="mb-1 flex items-center">
                        <div className="flex-1">
                          <div className="information">Khối lượng quy đổi:</div>
                        </div>
                        <div className="information mr-1 text-right">
                          {data.weight}{" "}
                        </div>
                      </span>
                    </div>
                    <div
                      className="flex-1 border-t border-black pl-1 pt-3"
                      style={{ flexBasis: "75%" }}
                    >
                      <p className="title mb-2 mt-1">12. Chú dẫn nghiệp vụ: </p>
                    </div>
                  </div>
                </div>
                {/* Khung thứ ba */}
                <div className="flex h-[30%] border-black">
                  {/* Chia thành 2 nửa */}
                  <div
                    className="flex-1 border border-black pl-1"
                    style={{ flexBasis: "65%" }}
                  >
                    <div className="title flex-1 text-center">
                      13. Bưu cục chấp nhận
                    </div>
                    <div className="information mt-1 flex-1 text-center">
                      Chữ ký GDV nhận{" "}
                    </div>
                  </div>
                  <div
                    className="flex-1 border border-black pl-1"
                    style={{ flexBasis: "35%" }}
                  >
                    <div className="title flex-1">14. Ngày giờ nhận</div>
                    <div className="title mt-1 flex-1">
                      ....h...../...../20.....
                    </div>
                    <div className="information mt-1 flex-1 text-center">
                      Người nhận/ Người được
                    </div>
                    <div className="information flex-1 text-center">
                      ủy quyền nhận
                    </div>
                    <div className="information flex-1 text-center">
                      (Ký, ghi rõ họ tên)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

InvoicePrintModal.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  data: PropTypes.object,
};
