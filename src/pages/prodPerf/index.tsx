import { useEffect, useState } from "react";
import { Sticky, Dropdown } from "@arco-design/mobile-react";
import {
  IconFilter,
  IconLeft,
  IconRight,
  IconLoop,
} from "@arco-design/web-react/icon";
import { getOverviewProduct } from "../../api/prod";
import {
  List,
  Card,
  Button as PCButton,
  Spin,
  Input,
  Descriptions,
} from "@arco-design/web-react";
// utils
import { pacificTime } from "../../utils/dayjs";
import { DataType } from "@arco-design/web-react/es/Descriptions/interface";
import { formatMoney } from "../../utils/format";
import SelectCustomize from "../../components/select-customize";
import { filterValueInit } from "../../constant/global";

const ProdPerf = () => {
  const [topProductList, setTopProductList] = useState<PROD.topProducts[]>([]);
  const [compareTopProductList, setCompareTopProductList] = useState<
    PROD.compareTopProducts[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterValue, setFilterValue] =
    useState<GLOBAL.filterType>(filterValueInit);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchOption, setSearchOption] = useState<PROD.searchOption>({
    reset: true,
    search: "",
    start: "",
    end: "",
  });
  const handleShowChange = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFilter = async (filterValue: GLOBAL.filterType) => {
    setFilterValue(filterValue);
    sessionStorage.setItem("filterValue", JSON.stringify(filterValue));
    if (filterValue.compareType == "single") {
      await getTopProductList(searchOption, filterValue);
    } else {
      await getCompareTopProductList(searchOption, filterValue);
    }
  };

  const getCompareTopProductList = async (
    searchOption: PROD.searchOption,
    filterValue: GLOBAL.filterType
  ) => {
    const { search } = searchOption;
    setLoading(true);
    const currentDate = [
      filterValue.dateRange?.[0],
      filterValue.dateRange?.[1],
    ];
    const compareDate = [
      filterValue.compareRange?.[0],
      filterValue.compareRange?.[1],
    ];
    const startTime1 = pacificTime(currentDate[0])
      .startOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const endDate1 = pacificTime(currentDate[1])
      .endOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const startTime2 = pacificTime(compareDate[0])
      .startOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const endDate2 = pacificTime(compareDate[1])
      .endOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let new_topProductList: PROD.compareTopProducts[] = [];
    await getOverviewProduct(startTime1, endDate1, 10000).then((res) => {
      let topProductList = [...res.rankings.topProducts];
      if (search) {
        topProductList = [...topProductList].filter((item) =>
          (item.name || "").includes(search)
        );
      }
      new_topProductList = [
        ...topProductList.map((item) => {
          return {
            id: item.id,
            name: item.name,
            netSales1: item.netSales,
            sold1: item.sold,
            product: item.product,
          };
        }),
      ];
    });
    await getOverviewProduct(startTime2, endDate2, 10000).then((res) => {
      let topProductList = [...res.rankings.topProducts];
      if (search) {
        topProductList = [...topProductList].filter((item) =>
          (item.name || "").includes(search)
        );
      }
      for (let i = 0; i < topProductList.length; i++) {
        const index = new_topProductList.findIndex(
          (item) => item.id == topProductList[i].id
        );
        if (index != -1) {
          new_topProductList[i] = {
            ...new_topProductList[i],
            netSales2: topProductList[i].netSales,
            sold2: topProductList[i].sold,
          };
        } else {
          new_topProductList.push({
            id: topProductList[i].id,
            name: topProductList[i].name,
            netSales1: 0,
            sold1: 0,
            product: topProductList[i].product,
            netSales2: topProductList[i].netSales,
            sold2: topProductList[i].sold,
          });
        }
      }
    });
    if (filterValue.sortType) {
      new_topProductList = new_topProductList.sort(
        (a, b) =>
          b[
            (filterValue.sortType as "sold" | "netSales") == "sold"
              ? "sold1"
              : "netSales1"
          ] -
          a[
            (filterValue.sortType as "sold" | "netSales") == "sold"
              ? "sold1"
              : "netSales1"
          ]
      );
    }
    setCompareTopProductList(new_topProductList);
    setLoading(false);
    setShowDropdown(false);
  };

  const getTopProductList = async (
    searchOption: PROD.searchOption,
    filterValue: GLOBAL.filterType
  ) => {
    const { reset, search } = searchOption;
    setLoading(true);
    const currentDate = filterValue.startTime
      ? filterValue.endTime
        ? [filterValue.startTime, filterValue.endTime]
        : [filterValue.startTime, filterValue.startTime]
      : [filterValue.singleTime, filterValue.singleTime];
    const startTime = pacificTime(currentDate[0])
      .startOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    const endDate = pacificTime(currentDate[1])
      .endOf("day")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    await getOverviewProduct(startTime, endDate, 10000).then((res) => {
      let new_topProductList = [];
      if (!reset)
        new_topProductList = [...topProductList, ...res.rankings.topProducts];
      else new_topProductList = [...res.rankings.topProducts];
      if (search) {
        new_topProductList = [...new_topProductList].filter((item) =>
          (item.name || "").includes(search)
        );
      }
      if (filterValue.sortType) {
        new_topProductList = new_topProductList.sort(
          (a, b) =>
            b[filterValue.sortType as "sold" | "netSales"] -
            a[filterValue.sortType as "sold" | "netSales"]
        );
      }
      setTopProductList(new_topProductList);
      setLoading(false);
    });
    setShowDropdown(false);
  };

  useEffect(() => {
    const sessionFilterValue = sessionStorage.getItem("filterValue");
    if (sessionFilterValue) {
      handleFilter(JSON.parse(sessionFilterValue));
    } else getTopProductList(searchOption, filterValue);
  }, []);

  return (
    <div>
      <Sticky
        style={{
          width: "100%",
        }}
        topOffset={0}
        getScrollContainer={() =>
          document.getElementById("main-scroll-container") || window
        }
      >
        <div
          style={{
            height: "max-content",
            backgroundColor: "#FFFFFF",
            padding: 16,
          }}
        >
          <div
            style={{
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Input
                style={{ height: 32 }}
                placeholder="Enter name to search"
                allowClear
                value={searchOption.search}
                onClear={() => {
                  setSearchOption({ ...searchOption, search: "" });
                }}
                onChange={(value) => {
                  setSearchOption({ ...searchOption, search: value });
                }}
              />
              <PCButton
                type="primary"
                onClick={async () => {
                  await getTopProductList(searchOption, filterValue);
                }}
              >
                Search
              </PCButton>
            </div>
            <span
              className="filter-trigger"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setShowDropdown((v) => !v)}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <IconFilter style={{ fontSize: 20, color: "#4E5969" }} />
            </span>
            <Dropdown
              clickOtherToClose={true}
              isStopTouchEl={(target) => {
                const el = target as Element;
                return !!el.closest(".select-customize, .filter-trigger");
              }}
              showDropdown={showDropdown}
              onOptionChange={handleShowChange}
              onCancel={() => setShowDropdown(false)}
            >
              <SelectCustomize
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                handleConfirm={handleFilter}
                pageType={"prod"}
              />
            </Dropdown>
          </div>
          {filterValue?.compareType == "single" ? (
            <div
              style={{
                height: 22,
                backgroundColor: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#1D2129",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {filterValue?.startTime && filterValue?.endTime
                  ? `Select: ${pacificTime(filterValue?.startTime).format(
                      "MM-DD-YYYY"
                    )},${pacificTime(filterValue?.endTime).format(
                      "MM-DD-YYYY"
                    )}`
                  : `${
                      pacificTime().startOf("day").format("MM-DD-YYYY") ==
                      pacificTime(
                        filterValue?.startTime || filterValue.singleTime
                      )
                        .startOf("day")
                        .format("MM-DD-YYYY")
                        ? "Today "
                        : ""
                    }${pacificTime(
                      filterValue?.startTime || filterValue.singleTime
                    ).format("MM-DD-YYYY")}`}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {!filterValue?.endTime && (
                  <IconLeft
                    style={{
                      color: "#4E5969",
                    }}
                    onClick={() => {
                      const new_singleTime = pacificTime(
                        filterValue?.startTime || filterValue.singleTime
                      )
                        .subtract(1, "day")
                        .valueOf();
                      setFilterValue({
                        ...filterValue,
                        singleTime: new_singleTime,
                        startTime: filterValue.startTime
                          ? new_singleTime
                          : undefined,
                      });
                      getTopProductList(searchOption, {
                        ...filterValue,
                        singleTime: new_singleTime,
                        startTime: filterValue.startTime
                          ? new_singleTime
                          : undefined,
                      });
                    }}
                  />
                )}
                {!filterValue?.endTime && (
                  <IconRight
                    style={{
                      color:
                        pacificTime(
                          filterValue.startTime || filterValue.singleTime
                        )
                          .startOf("day")
                          .valueOf() < pacificTime().startOf("day").valueOf()
                          ? "#4E5969"
                          : "#4E59694D",
                    }}
                    onClick={() => {
                      if (
                        pacificTime(
                          filterValue.startTime || filterValue.singleTime
                        )
                          .startOf("day")
                          .valueOf() < pacificTime().startOf("day").valueOf()
                      ) {
                        const new_singleTime = pacificTime(
                          filterValue?.startTime || filterValue.singleTime
                        )
                          .add(1, "day")
                          .valueOf();
                        setFilterValue({
                          ...filterValue,
                          singleTime: new_singleTime,
                          startTime: filterValue.startTime
                            ? new_singleTime
                            : undefined,
                        });
                        getTopProductList(searchOption, {
                          ...filterValue,
                          singleTime: new_singleTime,
                          startTime: filterValue.startTime
                            ? new_singleTime
                            : undefined,
                        });
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                color: "#1D2129",
                backgroundColor: "#FFFFFF",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>Select:</div>
                <IconLoop
                  style={{
                    color: "#4E5969",
                  }}
                  onClick={async () => {
                    setFilterValue(filterValueInit);
                    await getTopProductList(searchOption, filterValueInit);
                  }}
                />
              </div>
              <div
                style={{
                  overflow: "auto",
                  whiteSpace: "nowrap",
                  width: "100%",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >{`Date1: ${pacificTime(filterValue?.dateRange?.[0]).format(
                "MM-DD-YYYY"
              )} - ${pacificTime(filterValue?.dateRange?.[1]).format(
                "MM-DD-YYYY"
              )}; Date2: ${pacificTime(filterValue?.compareRange?.[0]).format(
                "MM-DD-YYYY"
              )} - ${pacificTime(filterValue?.compareRange?.[1]).format(
                "MM-DD-YYYY"
              )}`}</div>
            </div>
          )}
        </div>
      </Sticky>
      <Spin loading={loading} style={{ display: "block" }}>
        <Card
          style={{ margin: "16px" }}
          bordered={false}
          bodyStyle={{ padding: "0px 14px" }}
        >
          <List
            bordered={false}
            size={"small"}
            header={null}
            dataSource={
              filterValue.compareType == "single"
                ? topProductList
                : compareTopProductList
            }
            render={(item, index) => {
              const data = item?.product?.variation || item?.product?.product;
              const productData: DataType =
                filterValue.compareType == "single"
                  ? [
                      {
                        label: "Items Sold",
                        value: item.sold,
                      },
                      {
                        label: "Net Sales",
                        value: formatMoney(item.netSales),
                      },
                    ]
                  : [
                      {
                        label: "Sales Quantity-Date1",
                        value: (
                          <span
                            style={{
                              color: "#0E42D2",
                            }}
                          >
                            {item.sold1}
                          </span>
                        ),
                      },
                      {
                        label: "Sales Quantity-Date2",
                        value: (
                          <span
                            style={{
                              color: "#009A29",
                            }}
                          >
                            {item.sold2}
                          </span>
                        ),
                      },
                      {
                        label: "Items Sold-Date1",
                        value: (
                          <span
                            style={{
                              color: "#0E42D2",
                            }}
                          >
                            {formatMoney(item.netSales1 || 0)}
                          </span>
                        ),
                      },
                      {
                        label: "Items Sold-Date2",
                        value: (
                          <span
                            style={{
                              color: "#009A29",
                            }}
                          >
                            {formatMoney(item.netSales2 || 0)}
                          </span>
                        ),
                      },
                    ];
              return (
                <List.Item
                  key={index}
                  style={{
                    padding: "12px 0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={data?.image?.src || ""}
                      alt={data?.image?.name || ""}
                      width={40}
                      height={40}
                    />
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          color: "#1D2129",
                          fontWeight: 500,
                        }}
                      >
                        {item?.name}
                      </div>
                      {filterValue.compareType == "single" ? (
                        <Descriptions
                          data={productData}
                          column={1}
                          style={{
                            width: "100%",
                          }}
                          labelStyle={{
                            paddingBottom: "4px",
                            height: 22,
                            color: "#86909C",
                            fontWeight: 400,
                          }}
                          valueStyle={{
                            paddingBottom: "4px",
                            textAlign: "right",
                          }}
                        />
                      ) : (
                        <Descriptions
                          data={productData}
                          column={1}
                          style={{
                            width: "100%",
                          }}
                          labelStyle={{
                            paddingBottom: "4px",
                            height: 22,
                            color: "#86909C",
                            fontWeight: 400,
                          }}
                          valueStyle={{
                            paddingBottom: "4px",
                            textAlign: "right",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default ProdPerf;
