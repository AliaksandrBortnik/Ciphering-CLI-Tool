Ciphering CLI Tool. CLI tool that will encode and decode a text by 3 substitution ciphers.
For example, config "C1-C1-R0-A" means "encode by Caesar cipher => encode by Caesar cipher => decode by ROT-8 => use Atbash"

Usages:

$ node my_ciphering_cli -c "C1-C1-R0-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Myxn xn nbdobm. Tbnnfzb ferlm "_" nhteru!

$ node my_ciphering_cli -c "C1-C0-A-R1-R0-A-R0-R0-C1-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Vhgw gw wkmxkv. Ckwwoik onauv "_" wqcnad!

$ node my_ciphering_cli -c "A-A-A-R1-R0-R0-R0-C1-C1-A" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt Hvwg wg gsqfsh. Asggous opcih "_" gmapcz!

$ node my_ciphering_cli -c "C1-R1-C0-C0-A-R0-R1-R1-A-C1" -i "./input.txt" -o "./output.txt"
input.txt This is secret. Message about "_" symbol!
output.txt This is secret. Message about "_" symbol!
