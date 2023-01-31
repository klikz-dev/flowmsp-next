import React from 'react';
import { Clearfix, MenuItem } from 'react-bootstrap';

class ContextMenu extends React.Component {

  render() {
    const contextMenu = (this.props.role === 'ADMIN' || this.props.role === 'PLANNER') ? this.props.contextMenu : null;
    const entity = contextMenu && contextMenu.entity;
    const style = {
      display: entity ? 'block' : 'none',
      position: 'absolute',
      left: entity ? entity.x : 0,
      top: entity ? entity.y : 0
    };
    return (
      <div style={style} className="context-menu-container">
        {contextMenu ? (
          <Clearfix>
            <ul className="dropdown-menu open">
              {contextMenu.items.map((menuItem, index) => (
                <MenuItem
                  key={index}
                  onSelect={e => this.props.handleContextMenuItemSelect(menuItem, entity)}
                >
                  {menuItem.label}
                </MenuItem>
              ))}
            </ul>
          </Clearfix>
        ) : null}
      </div>
    );
  }

}

export default ContextMenu;
