import React from 'react';
import MarkdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import MarkdownRenderer from '../utils/MarkdownRenderer';
import SlugGenerator from '../utils/SlugGenerator';
import HeadingExtractor from '../utils/HeadingExtractor';
import '../post.css'

// Initialize markdown-it
const mdParser = new MarkdownIt({ html: true });
mdParser.use(markdownItAttrs);

const title = 'ISA: Insruction Set Architecture (2)';

const postContent = `
# 3. Procedure

- Supporting procedures in computer hardware
    - 함수를 호출하는 데 있어서 어떤 것들이 support가 되어야 하는 지
    - 어떻게 컴퓨터 HW 안에서 Procedure를 지원하는 지

## **Prodecure Calling**

- 함수를 호출하는 6가지 절차
1. **Place parameters in registers**
    
    Main routine (**caller**) places parameters in a place where the procedure (**callee**) can access them // $a0 - $a3: four argument registers
    
    → main 함수에서 printf함수로 argument 전달하는 일
    
2. **Transfer control to procedure**
    
    **Caller** transfers control to the **callee**
    
    → main에서 printf로 control 전달
    
3. **Acquire storage for procedure** (procedure안 local 변수들/register을 위한 공간 확보)
    
    **Callee** acquires the storage resources needed
    
    → 필요한 메모리 공간을 확보
    
4. **Perform procedure’s operations → 수행**
    
    **Callee** performs the desired task
    
5. **Place result in register for caller** (caller에게 return값 전달하기 위해 register에 올려놓기)
    
    **Callee** places the result value in a place where the **caller** can access it
    
    // $v0 - $v1: two value registers for result values → caller가 접근할 수 있는 곳
    
    → caller가 접근할 수 있는 곳에 return 값을 저장해둠
    
6. **Return to place of call** (control을 원래 있던 애한테 돌려줌)
    
    **Callee** returns control to the **caller** → callee는 caller에게 control 전달
    
    $ra: one return address register to return to the point of origin 
    
    → ra 즉, return address를 통해 Main 함수로 다시 돌아갈 수 있음
    
![image16.png](./images/post6/16.png)

n.a. : reserve된 값

no: 유지되지 않아도 되는 값

yes: 유지되어야 하는 값

- **Procedure call instruction**
    - **Procedure call: jump and link**  **\`jal  ProcedureLabel\`**
        - **Address of following instruction put in $ra**
        - jumps to target address
        - 사용처: 함수 호출 시, 함수 안에 함수면 다시 돌아와야함 (printf 같은 거)
        - jump해서 코드를 실행한 후, 다시 원래 코드로 돌아와서 그 다음부터 이어서 코드 진행
        - $ra register에 다음 instruction의 주소를 넣어놨기 때문에 가능
    - **Procedure return: jump register  \`jr $ra\`**
        - Copies $ra to program counter
            
            return address에 있는 주소를 program counter에 복사하면 pc가 그 다음부터 실행 가능
            
        - Can also be used for computed jumps
- **Leaf Procedure Example**
    - 함수 안에서 더 이상 다른 함수 호출을 하지 않는 함수: Leaf 함수
    - C code
        
        \`\`\`c
        int leaf_example(int g, h, i, j)
        {
             int f;
             f = (g + h) – (i + j)
             return f;
        }
        \`\`\`
        
        - Arguments g, ..., j in $a0, ..., $a3
        - f in $s0 **(hence, need to save $s0 on stack)**
        - Result in $v0
        
        \`int main(){ int x,y,z; leaf_example(g,h,i,j); }\` 같은 함수에서 변수 x를 $s0저장했다고 했을 때, \`leaf_example\` 호출 시,  f가 $s0를 덮어쓰게 되니까 최종 main 함수의 x값이 달라짐. 따라서 $s0값을 stack(즉, 메모리)에 따로 보관해두고 \`leaf_example\`에서 쓴 뒤, main에서 다시 $s0에 stack(memory)에서 값을 가져와 저장함
        
    - Compiled MIPS code
        
        \`\`\`javascript
        leaf_example:
              addi  $sp,  $sp,  -12. // 0으로부터 12 byte 떨어진곳을 sp가 가리키게함
              sw    $t1,  8($sp)   // -12에서 +8 만큼 떨어진 곳에 $t1 값 저장 (-4)
              sw    $t0,  4($sp)   // -12에서 +4 만큼 떨어진 곳에 $t1 값 저장 (-8)
              sw    $s0,  0($sp)   // -12에서 0 만큼 떨어진 곳에 $t1 값 저장 (-12)
        		**// Save $t1, $t0, and $s0 on stack**
        		//각 값을 main에서 썼을 수 있는데 leaf에서도 쓰고싶어할 수도 있기때문에 메모리에 넣어줌
              add   $t0,  $a0,  $a1  // g+h
              add   $t1,  $a2,  $a3  // i+j
              sub   $s0,  $t0,  $t1  // f = (g + h) – (i + j)
        		**// Procedure body**
              add   $v0,  $s0,  $zero  // result, $s0->$v0로 옮겨달라: f에 값 옮겨달라
              lw    $s0,  0($sp)  // LIFO구조
        			lw    $t0,  4($sp)
        			lw    $t1,  8($sp)
        			addi  $sp,  $sp,  12 // 다시 sp 원상복구
        		**// Restore $s0, $t0, and $t1**
        			jr    $ra  // return: leaf 함수를 불러줬던 곳으로 return 하라
        \`\`\`
        

## **Local Data on the Stack**

- \`sp\` stack pointer: 현재 내 memory, 즉, stack의 위치를 가리키는 포인터
    - stack “grows”from high address to low address (위→아래 방향)
- \`$t1\` \`$t0\` \`$s0\` 3개의 4byte register가 덮어지기 때문에 12 bytes의 stack 공간 필요
- stack operation을 통해 main함수는 마치 leaf함수를 실행하지 않았던 거처럼 변수 사용 가능

- Leaf Procedure Example (Optimzed)
    
    \`\`\`nasm
    leaf_example:
          addi  $sp,  $sp,  -4. // 0으로부터 12 byte 떨어진곳을 sp가 가리키게함
          sw    $s0,  0($sp)   // -12에서 0 만큼 떨어진 곳에 $t1 값 저장 (-12)
    		**// Save $s0 on stack**
    
          add   $t0,  $a0,  $a1  // g+h
          add   $t1,  $a2,  $a3  // i+j
          sub   $s0,  $t0,  $t1  // f = (g + h) – (i + j)
    		**// Procedure body**
          add   $v0,  $s0,  $zero  // result, $s0->$v0로 옮겨달라: f에 값 옮겨달라
          lw    $s0,  0($sp)  // LIFO구조
    			addi  $sp,  $sp,  4 // 다시 sp 원상복구
    		**// Restore $s0**
    			jr    $ra  // return: leaf 함수를 불러줬던 곳으로 return 하라
    \`\`\`
    
    - 위 표 MIPS Register Convention Preserve on call에 따라 temporary register($t0-$t7)은 함수가 진행되는 동안 임의적으로 사용해도 됨
    - 이렇게 하는 가장 큰 이유: 위 과정에서 메모리에서 읽고 쓰고 하는 작업이 계속 일어나는 데 이건 computer process 입장에서 시간이 굉장히 오래 걸리기 때문에 최대한 줄이는 것이 좋음
    
- **Non-leaf Procedures**
    - Procedures that call other procedures
    - For nested call, caller needs to save on the stack
        - Its return address
        - Any arguments and temporaries needed after the call
    - Restore from the stack after the call
    
    \`\`\`nasm
    fact: addi $sp, $sp, -8 // adjust stack for 2 items 
            sw $ra, 4($sp) // save return address
            sw $a0, 0($sp) // save argument

            slti $t0,$a0,1 //testforn<1 
            beq $t0, $zero, L1

            addi $v0, $zero, 1// if so, result is 1 
            addi $sp, $sp, 8 // pop 2 items from stack 
            jr $ra // and return
    L1:
            addi $a0, $a0, -1 // else decrement n 
            jal fact // recursive call

            lw $a0, 0($sp) // restore original n
            lw $ra, 4($sp) // and return address
            addi $sp, $sp, 8 // pop 2 items from stack

            mul $v0, $a0, $v0// multiply to get result

            jr $ra // and return
    \`\`\`
    
![image2.png](./images/post6/17.png)  

- fp(frame pointer) : 항상 함수의 시작위치를 가리킴
    
- **Local Data on the Stack**
    ![image18.png](./images/post6/18.png)    
    
    - 함수가 커질 수록 procedure frame(activation record)가 커지게 되는 문제 발생
    - recursive 함수 = 고비용
        - 중간에 있는 process 안에 있는 register 정보 중 stack을 준비해서 overwrite될 수 있는 것들은 stack에 밀어넣어 저장해두고 해당 data를 다시 register로 가져오는 작업이 빈번하기 때문에 메모리 연산이 많이 일어나고 이로 인해서 성능이 낮아질 수 있음
        
- **Memory Layout**
    ![image19.png](./images/post6/19.png)    
    

# 4. Addressing

# 5. Translating and starting a program



`;

const Post9 = {
  id: 9,
  slug: SlugGenerator(title),
  title: title,
  date: 'June, 2024',
  tags: ['Computer Architecuture', 'ISA', 'Computer Science', 'MIPS'],
  excerpt: '컴퓨터 구조 전공 수업 내용을 바탕으로 정리한 포스팅이다. 컴퓨터 구조의 개요와 시스템의 작동 원리, ISA와 MIPS에 대해서 자세하게 다룬다. ',
  headings: HeadingExtractor(postContent),
  content: <MarkdownRenderer markdownText={postContent} /> // Render markdown using the MarkdownRenderer
};

export default Post9;

