import React from "react";
import { useListingsFilter } from "../../state/store";
import {Dropdown} from "../../components";
import { listingsFilterOptions, listingsFilterTitles } from "../../utils/references";
const ListingsFilter: React.FC = () => {
  const {listingsFilter, setListingsFilter} = useListingsFilter()
  console.log(listingsFilter)
  return (
    <div className="f-row">
      <div className="f-row">
        <div>img</div>
        <div>Sort by</div>
      </div>
      <Dropdown
        value={listingsFilter.type}
        handleSubmit={(value) => setListingsFilter({type: value, labelIds: listingsFilter.labelIds})}
        fieldEditingProps={{
          key: "listingsFilterType",
          typename: "Catalogue",
          id: "",
        }}
      >
        <Dropdown.Toggle/>
        <Dropdown.Menu>
          {listingsFilterOptions
            .filter((option) => option !== listingsFilter.type)
            .map((option: string) => (
              <Dropdown.Item
                title={listingsFilterTitles[option]}
                className="btn"
                key={option}
                value={option}
              >
                {option}
              </Dropdown.Item>
            ))
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default ListingsFilter