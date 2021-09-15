# 以太坊智能合约编程语言Solidity学习

官方文档：[Solidity develop 文档](https://solidity-cn.readthedocs.io/zh/develop/index.html)
语法速查：[Solidity语法关键字速查表](https://solidity-cn.readthedocs.io/zh/develop/miscellaneous.html#id7)
单位和全局变量速查：[单位和全局变量 — Solidity develop 文档](https://solidity-cn.readthedocs.io/zh/develop/units-and-global-variables.html)

## 版本杂注

```solidity
pragma solidity ^0.4.0;
```

为了避免未来被可能引入不兼容变更的编译器所编译，源文件应该被版本杂注 `pragma` 所注解，后面的 `0.4.0` 是编译器版本要求， `^` 代表编译器版本要大于等于后面规定的版本的同时不允许高于（包含）下一个不向下兼容的版本的编译器（比如0.5.0）版本编译

## 导入其他源文件

Solidity 所支持的导入语句，其语法同 JavaScript（从 ES6 起）非常类似，关键词为 `import` ，具体的格式有：

 `import *`

 `import * from`

 `import * as *`

 `import * as * from *`

特别的，在remix上面可以通过网络自动获取文件（目前仅支持来自github的文件）

## 合约结构

在 Solidity 中，合约类似于面向对象编程语言中的类。 每个合约中可以包含 状态变量、 函数、 函数修饰器、事件、 结构类型、 和 枚举类型 的声明，且合约可以从其他合约继承

```solidity
contract HelloWorld {
  // 状态变量
  string myName = "linwanghao";
  // 结构类型，类似c/c++结构体
  struct Voter { 
      uint weight;
      bool voted;
      address delegate;
      uint vote;
  }
  // 枚举类型
  enum State { Created, Locked, Inactive }

  // 函数
  function getName() public view returns(string memory){
      return myName;
  }
  
  function changeName(string memory newName) public {
      myName = newName;
  }

  // 函数修饰器
  modifier onlySeller() {
    require(
        msg.sender == seller,
        "Only seller can call this."
    );
    _;
  }

  // 事件
  event HighestBidIncreased(address bidder, uint amount); 
  // 触发事件
  function bid() public payable {
      // ...
      emit HighestBidIncreased(msg.sender, msg.value); 
  }
}
```

* 状态变量

  状态变量是永久地存储在合约存储中的值

* 函数

  函数是合约中代码的可执行单元

* 函数修饰器

  函数修饰器可以用来以声明的方式改良函数语义

* 事件

  事件是能方便地调用以太坊虚拟机日志功能的接口

* 结构类型

  结构是可以将几个变量分组的自定义类型

* 枚举类型

  枚举可用来创建由一定数量的“常量值”构成的自定义类型

## 基本数据类型

Solidity 是一种静态类型语言（强类型语言），这意味着每个变量（状态变量和局部变量）都需要在编译时指定变量的类型

### 值类型

#### 布尔类型 `bool`

可能的取值为字面常数值 true 和 false

#### 整形 `int/uint`

分别表示有符号和无符号的不同位数的整型变量。 支持关键字 uint8 到 uint256 （无符号，从 8 位到 256 位）以及 int8 到 int256，以 8 位为步长递增。 uint 和 int 分别是 uint256 和 int256 的别名

#### 定长浮点型 `fixed/ufixed`

**Solidity 还没有完全支持定长浮点型**。可以声明定长浮点型的变量，但不能给它们赋值或把它们赋值给其他变量。

运算结果出现浮点数会出错，中间结果为浮点数但是最后通过运算得到

#### 地址类型 `address`

地址类型存储一个 20 字节的值（以太坊地址的大小），相当于uint160。 地址类型也有成员变量，并作为所有合约的基础

#### 地址类型成员变量

* `balance` 和 `transfer`

  可以使用 balance 属性来查询一个地址的余额， 也可以使用 transfer 函数向一个地址发送 以太币Ether （以 wei 为单位）

* `send`

  send 是 transfer 的低级版本。如果执行失败，当前的合约不会因为异常而终止，但 send 会返回 false

* `call`,  `callcode` 和 `delegatecall`
  
  此外，为了与不符合应用二进制接口的合约交互，于是就有了可以接受任意类型任意数量参数的 call 函数。 这些参数会被打包到以 32 字节为单位的连续区域中存放。 其中一个例外是当第一个参数被编码成正好 4 个字节的情况。 在这种情况下，这个参数后边不会填充后续参数编码，以允许使用函数签名。这三个函数 `call` ， `delegatecall` 和 `callcode` 都是非常低级的函数，应该只把它们当作 最后一招 来使用，因为它们破坏了 Solidity 的类型安全性。

#### 定长字节数组 `byte`

关键字有： `bytes1` ， `bytes2` ， `bytes3` ， ...， `bytes32` 。 `byte` 是 `bytes1` 的别名， `.length` 表示这个字节数组的长度（只读），一旦被初始化之后便不能进行修改

#### 变长字节数组

* bytes
    变长字节数组

* string
    变长 UTF-8 编码字符串类型，一个中文字符占三个字节，一个英文字符占一个字节

#### 字面常数

* 地址字面常数

  比如像 `0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF` 这样的通过了地址校验和测试的十六进制字面常数属于 `address` 类型。 长度在 39 到 41 个数字的，没有通过校验和测试而产生了一个警告的十六进制字面常数视为正常的有理数字面常数。

* 有理数和整数字面常数

  支持科学计数法

* 字符串字面常数
* 十六进制字面常数

  十六进制字面常数以关键字 `hex` 打头，后面紧跟着用单引号或双引号引起来的字符串（例如， `hex"001122FF"` ）。 字符串的内容必须是一个十六进制的字符串，它们的值将使用二进制表示。

### 枚举类型

类似其他编程语言中的枚举

### 函数类型

函数类型是一种表示函数的类型。可以将一个函数赋值给另一个函数类型的变量，也可以将一个函数作为参数进行传递，还能在函数调用中返回函数类型变量。

```solidity
function (<parameter types>) {internal|external} [pure|constant|view|payable] [returns (<return types>)]
```

合约中的函数定义语法规则结合了js和java，规则如下：

* 首先使用`function name(入参)`定义一个函数
* 可选：参数列表后面紧跟的是函数可见性修饰符，提供`internal` 和 `external` 并支持 `public` 和 `private`
* 可选：访问修饰符下面是一些solidity特有的函数特性修饰符，取值范围为`payable`、`constant`、`view` 和 `pure`
* 可选：带有返回值的函数需要在函数特性修饰符后面进行声明，语法如`returns (出参)`，与参数类型相反，返回类型不能为空 —— 如果函数类型不需要返回，则需要删除整个 `returns (<return types>)` 部分
* 最后是`{函数体}`

#### 修饰符详解

* `internal` 和 `external`

Solidity 支持以 `public` 和 `private` 对函数可见性进行描述，但还提供了另外两个描述函数可见性的修饰词： `internal（内部）` 和 `external（外部）`

`public` ：内部、外部均可见（参考为存储/状态变量创建 getter 函数）  
`private` ：仅在当前合约内可见  
`external` ：仅在外部可见（仅可修饰函数）——就是说，仅可用于消息调用（即使在合约内调用，也只能通过 `this.func` 的方式）  
`internal` ：仅在内部可见（也就是在当前 Solidity 源代码文件内均可见，不仅限于当前合约内）

* `constant`，`view`，`pure` 和 `payable`

`pure` ：不允许修改或访问状态——但目前并不是强制的。  
`view` ：不允许修改状态——但目前不是强制的。  
`payable` ：允许从调用中接收 以太币Ether 。  
`constant` : 修饰函数时与 `view` 等价。

在Solidity中 `constant` ， `view` ， `pure` 三个函数修饰词的作用是告诉编译器，函数不改变或者不读取状态变量，这样函数执行就可以不消耗gas了（是完全不消耗！），因为不需要矿工来验证。

在Solidity v4.17之前，只有 `constant` ，后来有人嫌 `constant` 这个词本身代表变量中的常量，不适合用来修饰函数，所以将 `constant` 拆成了 `view` 和 `pure` 。

`payable` 关键字代表我们可以通过这个函数给我们的合约地址充值、转账

### 引用类型

#### 数据位置

与java编程语言不同，java中的变量都是存储在内存当中，只是有存储区段的上的不同，而solidity语言中的变量除了上述的值类型变量外所有的复杂类型，即 `数组` 和 `结构` 类型，都有一个额外属性， `“数据位置”` ，说明数据是保存在内存中（并不是永久存储）还是在存储（保存状态变量的地方）中

根据上下文不同，大多数时候数据有默认的位置，但也可以通过在类型名后增加关键字 `storage` 或 `memory` 进行修改。 函数参数（包括返回的参数）的数据位置默认是 `memory，` 局部变量的数据位置默认是 `storage` ，状态变量的数据位置强制是 `storage` （这是显而易见的）

也存在第三种数据位置， `calldata` ，这是一块只读的，且不会永久存储的位置，用来存储函数参数。 外部函数的参数（非返回参数）的数据位置被强制指定为 `calldata` ，效果跟 `memory` 差不多。

solidity的引用类型变量存储位置是非常特殊的一点，对此总结如下：

* 强制指定的数据位置：  

  外部函数的参数（不包括返回参数）： calldata  
  状态变量： storage

* 默认数据位置：  

  函数参数（包括返回参数）： memory  
  所有其它局部变量： storage

### 数组

数组可以在声明时指定长度，也可以动态调整大小

对于 `存储storage` 的数组来说，元素类型可以是任意的（即元素也可以是数组类型，映射类型或者结构体）  
对于 `内存memory` 的数组来说，元素类型不能是映射类型，如果作为 `public` 函数的参数，它只能是 `ABI 类型` 。

一个元素类型为 `T` ，固定长度为 `k` 的数组可以声明为 `T[k]` ，而动态数组声明为 `T[]`

举个例子，一个长度为 5，元素类型为 uint 的动态数组的数组，应声明为 `uint[][5]` （注意这里跟其它语言比，数组长度的声明位置是反的）  
要访问第三个动态数组的第二个元素，你应该使用 `x[2][1]` （数组下标是从 0 开始的，且访问数组时的下标顺序与声明时相反，也就是说， `x[2]` 是从右边减少了一级）

> 特别注意存储数组和内存数组、多维数组声明和访问时的下标顺序

#### 成员

* length

  数组有 `length` 成员变量表示当前数组的长度。 动态数组可以在存储（而不是 内存）中通过改变成员变量 `.length` 改变数组大小。并不能通过访问超出当前数组长度的方式实现自动扩展数组的长度。一经创建，内存数组的大小就是固定的（但却是动态的，也就是说，它依赖于运行时的参数）。

* push

  变长的存储数组以及 `bytes` 类型（而不是 string 类型）都有一个叫做 `push` 的成员函数，它用来附加新的元素到数组末尾。这个函数将返回新的数组长度。

### 结构体

类似c/c++中的结构体

### 映射（类似hash table）

映射类型在声明时的形式为 mapping(_KeyType => _ValueType)。 其中 _KeyType 可以是除了映射、变长数组、合约、枚举以及结构体以外的几乎所有类型。 _ValueType 可以是包括映射类型在内的任何类型。

映射与哈希表不同的地方： 在映射中，实际上并不存储 key，而是存储它的 keccak256 哈希值，从而便于查询实际的值。

> 映射不支持迭代，可以封装一个映射类型记录key和value的相关信息并提供相关的迭代操作函数

### 删除

`delete a` 的结果是将 `a` 的类型在初始化时的值赋值给 `a` 。即对于整型变量来说，相当于 `a = 0` ， 但 `delete` 也适用于数组，对于动态数组来说，是将数组的长度设为 0，而对于静态数组来说，是将数组中的所有元素重置。 如果对象是结构体，则将结构体中的所有属性重置。

## 特殊操作符

### `a**b`

a的b次幂，例如 `2**4` 等于16

## 单位和全局变量

### 以太币（Ether）单位

以太币单位之间的换算就是在数字后边加上 `wei` 、 `finney` 、 `szabo` 或 `ether` 来实现的，如果后面没有单位，缺省为 Wei。例如 `2 ether == 2000 finney` 的逻辑判断值为 `true` 。

### 时间单位

秒是缺省时间单位，在时间单位之间，数字后面带有 `seconds` 、 `minutes` 、 `hours` 、 `days` 、 `weeks` 和 `years` 的可以进行换算，基本换算关系如下：

 `1 == 1 seconds`

 `1 minutes == 60 seconds`

 `1 hours == 60 minutes`

 `1 days == 24 hours`

 `1 weeks == 7 days`

 `1 years == 365 days`

> `years` 后缀已经不推荐使用了

### 特殊变量和函数

在全局命名空间中已经存在了（预设了）一些特殊的变量和函数，他们主要用来提供关于区块链的信息或一些通用的工具函数。

#### 区块和交易属性

* `block.blockhash(uint blockNumber)`：指定区块的区块哈希——仅可用于最新的 256 个区块且不包括当前区块
* `block.coinbase (address)`: 挖出当前区块的矿工地址
* `block.difficulty (uint)`: 当前区块难度
* `block.gaslimit (uint)`: 当前区块 gas 限额
* `block.number (uint)`: 当前区块号
* `block.timestamp (uint)`: 自 unix epoch 起始当前区块以秒计的时间戳
* `gasleft() returns (uint256)`：剩余的 gas
* `msg.data (bytes)`: 完整的 calldata
* `msg.gesleft()`: 剩余 gas
* `msg.sender (address)`: 消息发送者（当前调用）
* `msg.sig (bytes4)`: calldata 的前 4 字节（也就是函数标识符）
* `msg.value (uint)`: 随消息发送的 wei 的数量
* `now (uint)`: 目前区块时间戳（`block.timestamp`）
* `tx.gasprice (uint)`: 交易的 gas 价格
* `tx.origin (address)`: 交易发起者（完全的调用链）

#### 错误处理

* `assert(bool condition)`:
如果条件不满足，则使当前交易没有效果 — 用于检查内部错误。
* `require(bool condition)`:
如果条件不满足则撤销状态更改 - 用于检查由输入或者外部组件引起的错误。
* `require(bool condition, string message)`:
如果条件不满足则撤销状态更改 - 用于检查由输入或者外部组件引起的错误，可以同时提供一个错误消息。
* `revert()`:
终止运行并撤销状态更改。
* `revert(string reason)`:
终止运行并撤销状态更改，可以同时提供一个解释性的字符串。

#### 数学和密码学函数

* `addmod(uint x, uint y, uint k) returns (uint)`:
计算 `(x + y) % k` ，加法会在任意精度下执行，并且加法的结果即使超过 `2**256` 也不会被截取。从 0.5.0 版本的编译器开始会加入对 `k != 0` 的校验（assert）。
* `mulmod(uint x, uint y, uint k) returns (uint)`:
计算 `(x * y) % k` ，乘法会在任意精度下执行，并且乘法的结果即使超过 `2**256` 也不会被截取。从 0.5.0 版本的编译器开始会加入对 `k != 0` 的校验（assert）。
* `keccak256(...) returns (bytes32)`:
计算 (tightly packed) arguments 的 Ethereum-SHA-3 （Keccak-256）哈希。
* `sha256(...) returns (bytes32)`:
计算 (tightly packed) arguments 的 SHA-256 哈希。
* `sha3(...) returns (bytes32)`:
等价于 keccak256。
* `ripemd160(...) returns (bytes20)`:
计算 (tightly packed) arguments 的 RIPEMD-160 哈希。
* `ecrecover(bytes32 hash, uint8 v, bytes32 r, bytes32 s) returns (address) `：
利用椭圆曲线签名恢复与公钥相关的地址，错误返回零值。 (example usage)

#### 地址相关

* `<address>.balance (uint256)`:
以 Wei 为单位的 地址类型 的余额。
* `<address>.transfer(uint256 amount)`:
向 地址类型 发送数量为 amount 的 Wei，失败时抛出异常，发送 2300 gas 的矿工费，不可调节。
* `<address>.send(uint256 amount) returns (bool)`:
向 地址类型 发送数量为 amount 的 Wei，失败时返回 `false` ，发送 2300 gas 的矿工费用，不可调节。
* `<address>.call(...) returns (bool)`:
发出低级函数 CALL，失败时返回 `false` ，发送所有可用 gas，可调节。
* `<address>.callcode(...) returns (bool)`：
发出低级函数 CALLCODE，失败时返回 `false` ，发送所有可用 gas，可调节。
* `<address>.delegatecall(...) returns (bool)`:
发出低级函数 DELEGATECALL，失败时返回 `false` ，发送所有可用 gas，可调节。

#### 合约相关

* `this (current contract's type)`:
当前合约，可以明确转换为 地址类型。
* `selfdestruct(address recipient)`:
销毁合约，并把余额发送到指定 地址类型。

## 表达式和控制结构

### 输入和输出参数

与 Javascript 一样，函数可能需要参数作为输入; 而与 Javascript 和 C 不同的是，它们可能返回任意数量的参数作为输出。

输出参数的声明方式在关键词 returns 之后，与输入参数的声明方式相同。 例如，如果我们需要返回两个结果：两个给定整数的和与积，我们应该写作

```solidity
pragma solidity ^0.4.16;

contract Simple {
    function arithmetics(uint _a, uint _b)
        public
        pure
        returns (uint o_sum, uint o_product)
    {
        o_sum = _a + _b;
        o_product = _a * _b;
    }
}
```

输出参数名可以被省略。输出值也可以使用 return 语句指定。返回的输出参数被初始化为 0；如果它们没有被显式赋值，它们就会一直为 0。

### 控制结构

JavaScript 中的大部分控制结构在 Solidity 中都是可用的，除了 `switch` 和 `goto` 。 因此 Solidity 中有 `if` ， `else` ， `while` ， `do` ， `for` ， `break` ， `continue` ， `return` ， `? :` 这些与在 C 或者 JavaScript 中表达相同语义的关键词。

用于表示条件的括号 不可以 被省略，单语句体两边的花括号可以被省略。

注意，与 C 和 JavaScript 不同， Solidity 中非布尔类型数值不能转换为布尔类型，因此 if (1) { ... } 的写法在 Solidity 中 无效 。
